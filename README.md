# Companion

Rede social acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. Dúvidas por matéria, respostas, perfis, moderação e painel de denúncias.

- **Backend:** Java 21, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Gradle.
- **Frontend:** React 19, Vite, Tailwind.
- **Banco:** MySQL 8.4 instalado localmente.

## Requisitos

JDK 21, Node.js 20.19+ e MySQL Server 8.4. O MySQL Workbench é opcional: é só uma interface para o banco.

## Como rodar

1. **Variáveis de ambiente:** copie `.env.example` para `.env` na raiz e preencha todos os valores. O `JWT_SECRET` precisa ter pelo menos 32 caracteres. O `.env` não é versionado.
2. **Banco:** com o MySQL rodando, crie o banco e o usuário com os mesmos valores do `.env`:

   ```sql
   CREATE DATABASE <MYSQL_DATABASE> CHARACTER SET utf8mb4;
   CREATE USER '<MYSQL_USER>'@'localhost' IDENTIFIED BY '<MYSQL_PASSWORD>';
   GRANT ALL PRIVILEGES ON <MYSQL_DATABASE>.* TO '<MYSQL_USER>'@'localhost';
   ```

3. **Backend** (as tabelas são criadas pelo Hibernate):

   ```powershell
   cd backend
   .\gradlew.bat bootRun --args="--spring.profiles.active=dev"
   ```

   O perfil `dev` mostra o link de recuperação de senha no console; fora dele, configure o SMTP no `.env`. A API fica em `http://localhost:8080/api`.
4. **Frontend:** crie `frontend/.env.local` com `VITE_API_BASE_URL=http://localhost:8080/api` e rode:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Abra `http://localhost:5173`. Reinicie o `npm run dev` se mudar o `.env.local`.

O passo a passo detalhado, com a instalação do MySQL e do Workbench, está no `companion-local.txt` (arquivo privado, fora do Git).

## Dados de exemplo

Para ter usuários, dúvidas, respostas, curtidas e seguidores prontos, suba o backend com o perfil `seed` (migração Flyway em `backend/src/main/resources/db/seed`):

```powershell
.\gradlew.bat bootRun --args="--spring.profiles.active=dev,seed"
```

Os usuários (como `ana.exemplo@edu.unifor.br` ou `anabeatriz`) usam a senha `Senha123`. Repetir o comando não duplica nada.

## Primeiro administrador

Cadastros públicos sempre recebem o papel `USER`. Cadastre a conta pelo app e promova-a no banco:

```sql
UPDATE users SET role = 'ADMIN' WHERE id = X;
```

Entre de novo para o papel valer no token.

## Testes

```powershell
cd backend
.\gradlew.bat test
```
