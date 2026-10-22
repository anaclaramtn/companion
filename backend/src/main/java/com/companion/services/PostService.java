package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostCreateRequestDTO;
import com.companion.dtos.post.PostResponseDTO;
import com.companion.entities.Post;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.ForbiddenOperationException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostCommentRepository postCommentRepository;
    private final SubjectService subjectService;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public PostService(PostRepository postRepository, PostLikeRepository postLikeRepository,
                       PostCommentRepository postCommentRepository, SubjectService subjectService,
                       UserService userService, AuthenticatedUserService authenticatedUserService) {
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
        this.postCommentRepository = postCommentRepository;
        this.subjectService = subjectService;
        this.userService = userService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public PostResponseDTO create(PostCreateRequestDTO request) {
        User author = authenticatedUserService.getCurrentUserWithCompleteProfile();
        Post post = new Post(author, subjectService.find(request.subjectId()),
                request.title().trim(), request.content().trim());
        return toResponse(postRepository.save(post), author.getId());
    }

    @Transactional(readOnly = true)
    public PostResponseDTO get(Long id) {
        User viewer = authenticatedUserService.getCurrentUserWithCompleteProfile();
        return toResponse(findActive(id), viewer.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponseDTO> search(String query, Long subjectId, Long authorId, int page, int size) {
        User viewer = authenticatedUserService.getCurrentUserWithCompleteProfile();
        if (authorId != null) userService.findVisibleUser(authorId);
        Page<Post> posts = postRepository.searchActive(
                query == null || query.isBlank() ? null : query.trim(), subjectId, authorId,
                PageRequest.of(page, Math.min(size, 10), Sort.by("createdAt").descending()));
        return pageWithMetrics(posts, viewer.getId());
    }

    @Transactional
    public void delete(Long id) {
        User actor = authenticatedUserService.getCurrentUserWithCompleteProfile();
        Post post = findActive(id);
        boolean moderator = actor.getRole() == UserRole.MODERATOR || actor.getRole() == UserRole.ADMIN;
        if (!post.getAuthor().getId().equals(actor.getId()) && !moderator) {
            throw new ForbiddenOperationException("Somente o autor ou a moderação pode excluir o post");
        }
        post.delete();
        postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Post findActive(Long id) {
        return postRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado"));
    }

    public PostResponseDTO toResponse(Post post, Long viewerId) {
        return new PostResponseDTO(
                post.getId(), userService.toSummary(post.getAuthor()), subjectService.toResponse(post.getSubject()),
                post.getTitle(), post.getContent(), post.getCreatedAt(),
                postLikeRepository.countByPostId(post.getId()),
                postCommentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                postLikeRepository.existsByUserIdAndPostId(viewerId, post.getId()),
                post.getAuthor().getId().equals(viewerId)
        );
    }

    public PageResponse<PostResponseDTO> pageWithMetrics(Page<Post> posts, Long viewerId) {
        List<Long> ids = posts.getContent().stream().map(Post::getId).toList();
        Map<Long, Long> likes = countMap(ids, postLikeRepository::countByPostIds);
        Map<Long, Long> comments = countMap(ids, postCommentRepository::countActiveByPostIds);
        Set<Long> liked = ids.isEmpty() ? Set.of() : new HashSet<>(postLikeRepository.findLikedPostIds(viewerId, ids));
        Page<PostResponseDTO> mapped = posts.map(post -> new PostResponseDTO(
                post.getId(), userService.toSummary(post.getAuthor()), subjectService.toResponse(post.getSubject()),
                post.getTitle(), post.getContent(), post.getCreatedAt(),
                likes.getOrDefault(post.getId(), 0L), comments.getOrDefault(post.getId(), 0L),
                liked.contains(post.getId()), post.getAuthor().getId().equals(viewerId)));
        return PageResponse.from(mapped);
    }

    private Map<Long, Long> countMap(List<Long> ids,
                                     Function<Collection<Long>, List<PostCountProjection>> loader) {
        if (ids.isEmpty()) return Map.of();
        return loader.apply(ids).stream().collect(Collectors.toMap(PostCountProjection::getPostId,
                PostCountProjection::getTotal));
    }
}
