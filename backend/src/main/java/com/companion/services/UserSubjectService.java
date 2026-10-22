package com.companion.services;

import com.companion.dtos.subject.*;
import com.companion.entities.Subject;
import com.companion.entities.User;
import com.companion.entities.UserSubject;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.UserSubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserSubjectService {
    private final UserSubjectRepository userSubjectRepository;
    private final SubjectService subjectService;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public UserSubjectService(UserSubjectRepository userSubjectRepository, SubjectService subjectService,
                              UserService userService, AuthenticatedUserService authenticatedUserService) {
        this.userSubjectRepository = userSubjectRepository;
        this.subjectService = subjectService;
        this.userService = userService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public UserSubjectResponseDTO add(UserSubjectRequestDTO request) {
        User user = authenticatedUserService.getCurrentUser();
        if (userSubjectRepository.existsByUserIdAndSubjectId(user.getId(), request.subjectId())) {
            throw new DuplicateResourceException("A matéria já está associada ao perfil");
        }
        Subject subject = subjectService.find(request.subjectId());
        return toResponse(userSubjectRepository.saveAndFlush(
                new UserSubject(user, subject, request.interestType(), request.proficiency())));
    }

    @Transactional(readOnly = true)
    public List<UserSubjectResponseDTO> listMine() {
        return list(authenticatedUserService.getCurrentUser().getId());
    }

    @Transactional(readOnly = true)
    public List<UserSubjectResponseDTO> listForUser(Long userId) {
        userService.findVisibleUser(userId);
        return list(userId);
    }

    @Transactional(readOnly = true)
    public UserSubjectResponseDTO getMine(Long subjectId) {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        return toResponse(find(userId, subjectId));
    }

    @Transactional
    public UserSubjectResponseDTO updateMine(Long subjectId, UserSubjectUpdateRequestDTO request) {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        UserSubject relation = find(userId, subjectId);
        relation.update(request.interestType(), request.proficiency());
        return toResponse(userSubjectRepository.save(relation));
    }

    @Transactional
    public void removeMine(Long subjectId) {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        userSubjectRepository.delete(find(userId, subjectId));
    }

    private List<UserSubjectResponseDTO> list(Long userId) {
        return userSubjectRepository.findByUserIdOrderBySubjectNameAsc(userId).stream().map(this::toResponse).toList();
    }

    private UserSubject find(Long userId, Long subjectId) {
        return userSubjectRepository.findByUserIdAndSubjectId(userId, subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Associação de matéria não encontrada"));
    }

    private UserSubjectResponseDTO toResponse(UserSubject relation) {
        return new UserSubjectResponseDTO(
                relation.getId(), subjectService.toResponse(relation.getSubject()),
                relation.getInterestType(), relation.getProficiency());
    }
}
