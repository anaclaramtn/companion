package com.companion.services;

import com.companion.dtos.subject.SubjectRequestDTO;
import com.companion.dtos.subject.SubjectResponseDTO;
import com.companion.entities.Subject;
import com.companion.enums.UserRole;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.PostRepository;
import com.companion.repositories.SubjectRepository;
import com.companion.repositories.UserSubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final UserSubjectRepository userSubjectRepository;
    private final PostRepository postRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public SubjectService(SubjectRepository subjectRepository, UserSubjectRepository userSubjectRepository,
                          PostRepository postRepository, AuthenticatedUserService authenticatedUserService) {
        this.subjectRepository = subjectRepository;
        this.userSubjectRepository = userSubjectRepository;
        this.postRepository = postRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public SubjectResponseDTO create(SubjectRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        String name = request.name().trim();
        if (subjectRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Já existe uma matéria com esse nome");
        }
        return toResponse(subjectRepository.save(new Subject(name)));
    }

    @Transactional(readOnly = true)
    public SubjectResponseDTO get(Long id) { return toResponse(find(id)); }

    @Transactional(readOnly = true)
    public List<SubjectResponseDTO> list(String query) {
        if (query == null || query.isBlank()) {
            return subjectRepository.findAllByOrderByNameAsc().stream().map(this::toResponse).toList();
        }
        return subjectRepository.findByNameContainingIgnoreCaseOrderByNameAsc(
                query.trim(), org.springframework.data.domain.Pageable.unpaged()
        ).stream().map(this::toResponse).toList();
    }

    @Transactional
    public SubjectResponseDTO update(Long id, SubjectRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        Subject subject = find(id);
        String name = request.name().trim();
        if (subjectRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new DuplicateResourceException("Já existe uma matéria com esse nome");
        }
        subject.rename(name);
        return toResponse(subjectRepository.save(subject));
    }

    @Transactional
    public void delete(Long id) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        Subject subject = find(id);
        if (userSubjectRepository.existsBySubjectId(id) || postRepository.existsBySubjectId(id)) {
            throw new ConflictException("A matéria possui vínculos acadêmicos ou publicações e não pode ser excluída");
        }
        subjectRepository.delete(subject);
    }

    @Transactional(readOnly = true)
    public Subject find(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matéria não encontrada"));
    }

    public SubjectResponseDTO toResponse(Subject subject) {
        return new SubjectResponseDTO(subject.getId(), subject.getName());
    }
}
