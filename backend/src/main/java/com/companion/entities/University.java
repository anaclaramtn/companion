package com.companion.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "universities",
        uniqueConstraints = @UniqueConstraint(name = "uk_universities_acronym", columnNames = "acronym"))
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 20)
    private String acronym;

    // Guardado para uso futuro; o cadastro ainda não valida o domínio do e-mail.
    @Column(name = "email_domain", length = 100)
    private String emailDomain;

    protected University() { }

    public University(String name, String acronym, String emailDomain) {
        this.name = name;
        this.acronym = acronym;
        this.emailDomain = emailDomain;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAcronym() { return acronym; }
    public String getEmailDomain() { return emailDomain; }
}
