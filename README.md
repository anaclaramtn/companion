# Companion

Rede social acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. Reúne dúvidas por matéria, respostas, perfis, moderação e um painel de administração.

## Tecnologias

- **Backend:** Java 21, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Gradle.
- **Frontend:** React 19, Vite, Tailwind.
- **Banco:** MySQL 8.4.
- **Login:** Firebase Authentication (e-mail e senha, verificação de e-mail e recuperação de senha).

## Como funciona

O frontend autentica a pessoa no Firebase e envia o token para a API. O backend valida esse token, exige um e-mail `@edu.unifor.br` verificado e devolve o JWT do Companion, usado nas demais chamadas. Perfis, papéis e publicações ficam no MySQL; as senhas ficam somente no Firebase.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `backend/` | API em Spring Boot |
| `frontend/` | Aplicação React ([guia de componentes](frontend/GUIA_COMPONENTES.txt)) |
| `docs/modelo-entidades.puml` | Modelo de entidades |
| `docker-compose.yml` | MySQL, backend e frontend para desenvolvimento |

## Como rodar

Com Docker Desktop:

1. Crie um projeto no [Firebase](https://console.firebase.google.com), ative o login por **E-mail/senha**, autorize o domínio `localhost` e registre um app Web.
2. Copie `.env.example` para `.env` e preencha os valores, seguindo os comentários do arquivo.
3. Na raiz do projeto, execute `docker compose up --build`.

O frontend fica em `http://localhost:5173` e a API em `http://localhost:8080/api`.

Para carregar dados de exemplo em um projeto Firebase de desenvolvimento, defina `SPRING_PROFILES_ACTIVE=seed` e `SEED_USER_PASSWORD` no `.env`.

Todo cadastro começa com o papel `USER`. O primeiro administrador é definido direto no banco: `UPDATE users SET role='ADMIN' WHERE id=X;`.

## Testes

Na pasta `backend`, execute `.\gradlew.bat test`. Os testes não precisam de MySQL nem de um projeto no Firebase.
