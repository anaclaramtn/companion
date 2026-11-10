package com.companion.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "courses",
        uniqueConstraints = @UniqueConstraint(name = "uk_courses_university_name", columnNames = {"university_id", "name"}))
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "university_id", nullable = false, foreignKey = @ForeignKey(name = "fk_courses_university"))
    private University university;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "total_semesters", nullable = false)
    private Integer totalSemesters;

    protected Course() { }

    public Course(University university, String name, Integer totalSemesters) {
        this.university = university;
        this.name = name;
        this.totalSemesters = totalSemesters;
    }

    public Long getId() { return id; }
    public University getUniversity() { return university; }
    public String getName() { return name; }
    public Integer getTotalSemesters() { return totalSemesters; }
}
