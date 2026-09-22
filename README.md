# Companion

Companion é uma plataforma web acadêmica voltada para estudantes de Ciência da Computação da Universidade de Fortaleza (Unifor).

## Tecnologias

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- Gradle

### Banco de Dados
- MySQL 8.4

### Infra
- Docker
- Docker Compose
- Git

## Arquitetura

O projeto utiliza uma arquitetura monolítica em camadas no backend, expondo uma API REST consumida pelo front.

```text
React
  ↓
Axios
  ↓
REST API
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
JPA / Hibernate
  ↓
MySQL