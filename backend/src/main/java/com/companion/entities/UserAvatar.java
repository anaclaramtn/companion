package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Foto de perfil guardada no próprio banco. Fica em tabela separada de users
 * para as consultas de perfil e feed não carregarem os bytes da imagem.
 */
@Entity
@Table(name = "user_avatars")
public class UserAvatar {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "content_type", nullable = false, length = 30)
    private String contentType;

    // LONGBLOB explícito: sem isso o Hibernate cria TINYBLOB (255 bytes) no MySQL.
    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] data;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected UserAvatar() {
    }

    public UserAvatar(Long userId, String contentType, byte[] data) {
        this.userId = userId;
        replace(contentType, data);
    }

    public void replace(String contentType, byte[] data) {
        this.contentType = contentType;
        this.data = data;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getUserId() { return userId; }
    public String getContentType() { return contentType; }
    public byte[] getData() { return data; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
