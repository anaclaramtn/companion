package com.companion.config;

import com.companion.entities.Faq;
import com.companion.repositories.FaqRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FaqSeederTest {

    @Test
    void createsActiveFaqsInOrderWhenTableIsEmpty() {
        FaqRepository repository = mock(FaqRepository.class);
        when(repository.count()).thenReturn(0L);

        new FaqSeeder(repository).run(null);

        ArgumentCaptor<Faq> saved = ArgumentCaptor.forClass(Faq.class);
        verify(repository, times(10)).save(saved.capture());
        List<Faq> faqs = saved.getAllValues();
        assertEquals("O que é o Companion?", faqs.getFirst().getQuestion());
        assertEquals(1, faqs.getFirst().getDisplayOrder());
        assertEquals(10, faqs.getLast().getDisplayOrder());
        assertTrue(faqs.stream().allMatch(Faq::isActive));
        // Dúvidas e respostas não podem ser apagadas pelo app.
        Faq editFaq = faqs.stream()
                .filter(faq -> faq.getQuestion().startsWith("Posso editar"))
                .findFirst().orElseThrow();
        assertTrue(editFaq.getAnswer().contains("nem excluídas"));
    }

    @Test
    void keepsExistingFaqs() {
        FaqRepository repository = mock(FaqRepository.class);
        when(repository.count()).thenReturn(3L);

        new FaqSeeder(repository).run(null);

        verify(repository, never()).save(any());
    }
}
