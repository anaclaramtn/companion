package com.companion.services;

import com.companion.dtos.subject.SubjectRequestDTO;
import com.companion.dtos.subject.SubjectResponseDTO;
import com.companion.dtos.subject.TrendingSubjectResponseDTO;
import com.companion.entities.Subject;
import com.companion.entities.University;
import com.companion.enums.UserRole;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.CourseSubjectRepository;
import com.companion.repositories.PostRepository;
import com.companion.repositories.SubjectRepository;
import com.companion.repositories.UniversityRepository;
import com.companion.repositories.UserSubjectRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class SubjectService {
    public static final int TRENDING_DAYS = 7;

    private final SubjectRepository subjectRepository;
    private final UniversityRepository universityRepository;
    private final UserSubjectRepository userSubjectRepository;
    private final CourseSubjectRepository courseSubjectRepository;
    private final PostRepository postRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public SubjectService(SubjectRepository subjectRepository, UniversityRepository universityRepository,
                          UserSubjectRepository userSubjectRepository,
                          CourseSubjectRepository courseSubjectRepository, PostRepository postRepository,
                          AuthenticatedUserService authenticatedUserService) {
        this.subjectRepository = subjectRepository;
        this.universityRepository = universityRepository;
        this.userSubjectRepository = userSubjectRepository;
        this.courseSubjectRepository = courseSubjectRepository;
        this.postRepository = postRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public SubjectResponseDTO create(SubjectRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        University university = universityRepository.findById(request.universityId())
                .orElseThrow(() -> new ResourceNotFoundException("Universidade não encontrada"));
        String code = normalizeCode(request.code());
        if (subjectRepository.existsByUniversityIdAndCodeIgnoreCase(university.getId(), code)) {
            throw new DuplicateResourceException("Já existe uma matéria com esse código nesta universidade");
        }
        return toResponse(subjectRepository.save(new Subject(university, code, request.name().trim())));
    }

    @Transactional(readOnly = true)
    public SubjectResponseDTO get(Long id) { return toResponse(find(id)); }

    /** Matérias com mais dúvidas publicadas nos últimos {@value #TRENDING_DAYS} dias. */
    @Transactional(readOnly = true)
    public List<TrendingSubjectResponseDTO> trending(int limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(TRENDING_DAYS);
        return postRepository.findTrendingSubjects(since, PageRequest.of(0, limit)).stream()
                .map(item -> new TrendingSubjectResponseDTO(
                        item.getSubjectId(), item.getCode(), item.getName(), item.getPostCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SubjectResponseDTO> list(String query) {
        String text = query == null || query.isBlank() ? null : query.trim();
        return subjectRepository.search(text).stream().map(this::toResponse).toList();
    }

    @Transactional
    public SubjectResponseDTO update(Long id, SubjectRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        Subject subject = find(id);
        if (!subject.getUniversity().getId().equals(request.universityId())) {
            throw new BadRequestException("Não é possível mudar a universidade de uma matéria");
        }
        String code = normalizeCode(request.code());
        if (subjectRepository.existsByUniversityIdAndCodeIgnoreCaseAndIdNot(request.universityId(), code, id)) {
            throw new DuplicateResourceException("Já existe uma matéria com esse código nesta universidade");
        }
        subject.update(code, request.name().trim());
        return toResponse(subjectRepository.save(subject));
    }

    @Transactional
    public void delete(Long id) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        Subject subject = find(id);
        if (userSubjectRepository.existsBySubjectId(id) || postRepository.existsBySubjectsId(id)
                || courseSubjectRepository.existsBySubjectId(id)) {
            throw new ConflictException("A matéria possui vínculos com cursos, perfis ou publicações e não pode ser excluída");
        }
        subjectRepository.delete(subject);
    }

    @Transactional(readOnly = true)
    public Subject find(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matéria não encontrada"));
    }

    // Busca todas as matérias pedidas; falha se alguma não existir.
    @Transactional(readOnly = true)
    public Set<Subject> findAll(Collection<Long> ids) {
        Set<Long> uniqueIds = new LinkedHashSet<>(ids);
        List<Subject> subjects = subjectRepository.findAllById(uniqueIds);
        if (subjects.size() != uniqueIds.size()) {
            throw new ResourceNotFoundException("Matéria não encontrada");
        }
        return new LinkedHashSet<>(subjects);
    }

    public SubjectResponseDTO toResponse(Subject subject) {
        return new SubjectResponseDTO(subject.getId(), subject.getCode(), subject.getName());
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }
}
