package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
            "(:firstName IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
            "(:lastName IS NULL OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) AND " +
            "(:course IS NULL OR LOWER(s.course) LIKE LOWER(CONCAT('%', :course, '%'))) AND " +
            "(:department IS NULL OR LOWER(s.department) LIKE LOWER(CONCAT('%', :department, '%'))) AND " +
            "(:status IS NULL OR LOWER(s.status) = LOWER(:status))")
    List<Student> findStudents(@Param("firstName") String firstName,
                               @Param("lastName") String lastName,
                               @Param("course") String course,
                               @Param("department") String department,
                               @Param("status") String status);
}
