package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.dto.StudentResponse;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<StudentResponse> getStudents(String firstName, String lastName, String course, String department, String status) {
        return studentRepository.findStudents(firstName, lastName, course, department, status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StudentResponse getStudentById(Long id) {
        return mapToResponse(findStudent(id));
    }

    public StudentResponse createStudent(StudentRequest request) {
        Optional<Student> existing = studentRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Student with this email already exists");
        }

        Student student = mapToEntity(request);
        return mapToResponse(studentRepository.save(student));
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = findStudent(id);

        Optional<Student> existing = studentRepository.findByEmail(request.getEmail());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new IllegalArgumentException("Student with this email already exists");
        }

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setCourse(request.getCourse());
        student.setDepartment(request.getDepartment());
        student.setEnrollmentDate(request.getEnrollmentDate());
        student.setStatus(request.getStatus());

        return mapToResponse(studentRepository.save(student));
    }

    public void deleteStudent(Long id) {
        Student student = findStudent(id);
        studentRepository.delete(student);
    }

    private Student findStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    private Student mapToEntity(StudentRequest request) {
        return Student.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim())
                .phone(request.getPhone().trim())
                .course(request.getCourse().trim())
                .department(request.getDepartment().trim())
                .enrollmentDate(request.getEnrollmentDate())
                .status(request.getStatus().trim())
                .build();
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .course(student.getCourse())
                .department(student.getDepartment())
                .enrollmentDate(student.getEnrollmentDate())
                .status(student.getStatus())
                .build();
    }
}
