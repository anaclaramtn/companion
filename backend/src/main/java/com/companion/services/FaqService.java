package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.faq.FaqRequestDTO;
import com.companion.dtos.faq.FaqResponseDTO;
import com.companion.entities.Faq;
import com.companion.enums.UserRole;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.FaqRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FaqService {
    private final FaqRepository repository;
    private final AuthenticatedUserService authenticatedUserService;
    public FaqService(FaqRepository repository, AuthenticatedUserService authenticatedUserService) {
        this.repository = repository;
        this.authenticatedUserService = authenticatedUserService;
    }
    @Transactional(readOnly = true) public List<FaqResponseDTO> active() {
        return repository.findByActiveTrueOrderByDisplayOrderAscIdAsc().stream().map(this::toResponse).toList();
    }
    @Transactional(readOnly = true) public FaqResponseDTO activeById(Long id) {
        return toResponse(repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ não encontrada")));
    }
    @Transactional(readOnly = true) public PageResponse<FaqResponseDTO> all(int page, int size) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        return PageResponse.from(repository.findAllByOrderByDisplayOrderAscIdAsc(
                PageRequest.of(page, Math.min(size, 100))).map(this::toResponse));
    }
    @Transactional public FaqResponseDTO create(FaqRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        return toResponse(repository.save(new Faq(request.question().trim(), request.answer().trim(),
                request.displayOrder(), request.active())));
    }
    @Transactional public FaqResponseDTO update(Long id, FaqRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        Faq faq = find(id);
        faq.update(request.question().trim(), request.answer().trim(), request.displayOrder(), request.active());
        return toResponse(repository.save(faq));
    }
    @Transactional public void delete(Long id) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        repository.delete(find(id));
    }
    private Faq find(Long id) { return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("FAQ não encontrada")); }
    private FaqResponseDTO toResponse(Faq faq) { return new FaqResponseDTO(faq.getId(), faq.getQuestion(),
            faq.getAnswer(), faq.getDisplayOrder(), faq.isActive(), faq.getCreatedAt(), faq.getUpdatedAt()); }
}
