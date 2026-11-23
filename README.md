# Companion

Rede social acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. Dúvidas por matéria, respostas, perfis, moderação e painel de denúncias.

- **Backend:** Java 21, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Gradle.
- **Frontend:** React 19, Vite, Tailwind.
- **Banco:** MySQL 8.4.
- **Execução:** Docker Compose (MySQL + backend + frontend).

## Requisitos

Docker Desktop (com Docker Compose). Não é preciso instalar JDK, Node.js nem MySQL.

## Como rodar

1. **Variáveis de ambiente:** copie `.env.example` para `.env` na raiz e preencha os valores. O `JWT_SECRET` precisa ter pelo menos 32 caracteres. O `.env` não é versionado.
2. **Subir tudo** (a partir da raiz do projeto):

   ```powershell
   docker compose up --build
   ```

   - Frontend: `http://localhost:5173`
   - API: `http://localhost:8080/api`
   - MySQL (para o Workbench): `127.0.0.1:3307`, com o usuário e a senha do `.env`

   O banco, o usuário e as tabelas são criados automaticamente. A recuperação de senha ainda está em desenvolvimento no app.
3. **Parar:** `docker compose down` (mantém o banco) ou `docker compose down -v` (apaga o banco).

O passo a passo detalhado está no `companion-local.txt` (arquivo privado, fora do Git).

## Dados de exemplo

Para ter usuários, dúvidas, respostas, curtidas e seguidores prontos, defina `SPRING_PROFILES_ACTIVE=seed` no `.env` e recrie o backend. O perfil aplica as migrações Flyway de `backend/src/main/resources/db/seed`:

```powershell
docker compose up -d --force-recreate backend
```

| Migração | O que cria |
|---|---|
| `V1__usuarios_e_posts_de_exemplo` | 6 usuários, 12 dúvidas, respostas, curtidas e seguidores |
| `V2__mais_dados_com_fotos` | 8 usuários novos, 20 dúvidas, 37 respostas, 73 curtidas, 39 relações de seguidores e **fotos de perfil** para os 14 usuários |
| `V3__materias_dos_usuarios` | Matérias que cada um dos 14 usuários de exemplo domina (3 a 5) ou quer aprender, de acordo com a biografia; alimenta a busca **Social** |
| `V4__avatares_com_caminho_relativo` | Converte as fotos da V2 para caminho relativo (`/api/users/{id}/avatar`), para funcionarem fora do localhost |

Todos os usuários (como `ana.exemplo@edu.unifor.br` ou o username `anabeatriz`) usam a senha `Senha123`. Quem já aplicou as anteriores recebe só as novas, e repetir o comando não duplica nada. As fotos da V2 são avatares ilustrados gravados no próprio SQL; o endereço delas é gravado só como caminho (a V4 ajusta quem já aplicou a V2) e a API completa com o próprio endereço ao responder.

## Primeiro administrador

Cadastros públicos sempre recebem o papel `USER`. Cadastre a conta pelo app (com e-mail `@edu.unifor.br`) e promova-a no banco:

```powershell
docker compose exec db mysql -u<MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE> -e "UPDATE users SET role='ADMIN' WHERE id=X;"
```

Entre de novo para o papel valer no token.
