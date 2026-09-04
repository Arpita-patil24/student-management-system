# Student Management System

A full-stack student administration portal with CRUD functionality, search filters, and a clean API-driven architecture.

## Stack

- Backend: Java 21, Spring Boot 3.3.x, Spring Data JPA
- Frontend: React + Vite
- Database: H2 for local development, MySQL-ready configuration included

## Backend run

```bash
cd backend
mvn spring-boot:run
```

## Frontend run

```bash
cd frontend
npm install
npm run dev
```

## API endpoints

- `GET /api/students`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`

## Features

- Create, read, update, and delete students
- Filter by first name, last name, course, department, status
- Email uniqueness validation
- Global exception handling
- Responsive dashboard-ready UI shell
