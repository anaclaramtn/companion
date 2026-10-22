package com.companion.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects", uniqueConstraints = @UniqueConstraint(name = "uk_subjects_name", columnNames = "name"))
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    protected Subject() { }

    public Subject(String name) { this.name = name; }

    public void rename(String name) { this.name = name; }
    public Long getId() { return id; }
    public String getName() { return name; }
}
