# Companion

Companion é uma plataforma web acadêmica voltada para estudantes de Ciência da Computação da Universidade de Fortaleza (Unifor), criada para facilitar interação, compartilhamento de conhecimento e colaboração entre estudantes.

## Funcionalidades planejadas

- Autenticação e perfis de estudantes
- Publicação de posts, perguntas, respostas e comentários
- Busca e organização de conteúdo acadêmico
- Suporte aos estudantes e área administrativa

## Stack

- Frontend: React, Vite e Tailwind CSS
- Backend: Java 21, Spring Boot e Gradle
- Persistência: Spring Data JPA / Hibernate
- Banco de dados: MySQL
- Infraestrutura: Docker e Docker Compose

## Arquitetura

O backend utiliza uma arquitetura monolítica em camadas:

```text
React → API REST → Controller → Service → Repository → Entity → MySQL
```

O frontend está em `frontend/` e o backend em `backend/`. As orientações para desenvolvimento estão em [`docs/GUIA_DESENVOLVIMENTO.md`](docs/GUIA_DESENVOLVIMENTO.md).

## Status

Em desenvolvimento.

## Como clonar

```bash
git clone <https://github.com/anaclaramtn/companion>
cd companion
```
