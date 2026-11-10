package com.companion.entities;

import jakarta.persistence.*;

// Disciplina de uma universidade, identificada pelo código (ex.: T390).
// Os cursos e semestres em que ela aparece ficam em course_subjects.
@Entity
@Table(name = "subjects",
        uniqueConstraints = @UniqueConstraint(name = "uk_subjects_university_code", columnNames = {"university_id", "code"}))
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "university_id", nullable = false, foreignKey = @ForeignKey(name = "fk_subjects_university"))
    private University university;

    @Column(nullable = false, length = 10)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    protected Subject() { }

    public Subject(University university, String code, String name) {
        this.university = university;
        this.code = code;
        this.name = name;
    }

    public void update(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public Long getId() { return id; }
    public University getUniversity() { return university; }
    public String getCode() { return code; }
    public String getName() { return name; }
}
