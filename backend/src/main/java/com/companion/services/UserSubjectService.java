package com.companion.services;

import com.companion.dtos.subject.*;
import com.companion.entities.Subject;
import com.companion.entities.User;
import com.companion.entities.UserSubject;
import com.companion.enums.SubjectInterestType;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.UserSubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserSubjectService {
    static final int MAX_SUBJECTS_PER_GROUP = 5;

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
        requireRoomInGroup(user.getId(), request.interestType());
        return toResponse(userSubjectRepository.saveAndFlush(
                new UserSubject(user, subject, request.interestType())));
    }

    /**
     * Deixa o perfil exatamente com as matérias enviadas: atualiza as que já
     * existiam, remove as que ficaram de fora e cria as novas.
     */
    @Transactional
    public List<UserSubjectResponseDTO> replaceMine(UserSubjectsReplaceRequestDTO request) {
        User user = authenticatedUserService.getCurrentUser();
        Map<Long, SubjectInterestType> wanted = new LinkedHashMap<>();
        for (UserSubjectRequestDTO item : request.subjects()) {
            if (wanted.put(item.subjectId(), item.interestType()) != null) {
                throw new BadRequestException("Cada matéria pode aparecer uma só vez");
            }
        }
        for (SubjectInterestType type : SubjectInterestType.values()) {
            if (wanted.values().stream().filter(type::equals).count() > MAX_SUBJECTS_PER_GROUP) {
                throw new BadRequestException(groupLimitMessage());
            }
        }

        for (UserSubject relation : userSubjectRepository.findByUserIdOrderBySubjectNameAsc(user.getId())) {
            SubjectInterestType type = wanted.remove(relation.getSubject().getId());
            if (type == null) {
                userSubjectRepository.delete(relation);
            } else {
                relation.update(type);
            }
        }
        wanted.forEach((subjectId, type) ->
                userSubjectRepository.save(new UserSubject(user, subjectService.find(subjectId), type)));
        userSubjectRepository.flush();
        return list(user.getId());
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
        if (relation.getInterestType() != request.interestType()) {
            requireRoomInGroup(userId, request.interestType());
        }
        relation.update(request.interestType());
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

    // Mesmo limite do frontend (SubjectInterestPicker): até 5 matérias em cada grupo.
    private void requireRoomInGroup(Long userId, SubjectInterestType type) {
        long count = userSubjectRepository.findByUserIdOrderBySubjectNameAsc(userId).stream()
                .filter(relation -> relation.getInterestType() == type)
                .count();
        if (count >= MAX_SUBJECTS_PER_GROUP) throw new BadRequestException(groupLimitMessage());
    }

    private static String groupLimitMessage() {
        return "Escolha no máximo " + MAX_SUBJECTS_PER_GROUP + " matérias em cada grupo";
    }

    private UserSubject find(Long userId, Long subjectId) {
        return userSubjectRepository.findByUserIdAndSubjectId(userId, subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Associação de matéria não encontrada"));
    }

    private UserSubjectResponseDTO toResponse(UserSubject relation) {
        return new UserSubjectResponseDTO(
                relation.getId(), subjectService.toResponse(relation.getSubject()),
                relation.getInterestType());
    }
}
