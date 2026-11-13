# Companion

Rede social acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. API REST em Java 21/Spring Boot; o escopo funcional da versão 1.0 está em [docs/escopo_v1.md](docs/escopo_v1.md).

## Stack

- Backend: Java 21, Spring Boot 4, Spring Security, JWT, Spring Data JPA e Gradle.
- Banco: MySQL 8.4 instalado localmente.
- Testes: JUnit, Spring Test e H2 em modo de compatibilidade MySQL.

## Requisitos

- JDK 21;
- MySQL Server 8.4 e MySQL Workbench;
- Postman ou outro cliente HTTP.

## Configuração

1. Copie `.env.example` para `.env` e preencha todos os valores, inclusive o `JWT_SECRET` (mínimo de 32 caracteres). O `.env` é o único lugar com dados do banco e não é versionado.
2. Crie o banco e o usuário no MySQL com os mesmos valores do `.env` (veja a seção abaixo).
3. Inicie a API:

```powershell
cd backend
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

O perfil `dev` registra o link de recuperação de senha no console. Fora dele, configure o SMTP no `.env`. As tabelas são criadas automaticamente pelo Hibernate.

4. No Postman, use a base `http://localhost:8080/api` e envie o token retornado no login como `Authorization: Bearer <token>`.

## Abrindo o banco no MySQL Workbench

1. Abra o Workbench e clique em **+** ao lado de *MySQL Connections*.
2. Preencha com os valores do seu `.env`:
   - **Hostname:** `MYSQL_HOST`
   - **Port:** `MYSQL_PORT`
   - **Username:** `MYSQL_USER`
3. Clique em **Store in Vault…** e informe `MYSQL_PASSWORD`; depois **Test Connection** e **OK**.
4. Abra a conexão e, no painel *Schemas*, clique duas vezes no banco de `MYSQL_DATABASE` para usá-lo.

Se o banco ainda não existe, entre com um usuário administrador (como o `root`) e execute, trocando pelos valores do `.env`:

```sql
CREATE DATABASE <MYSQL_DATABASE> CHARACTER SET utf8mb4;
CREATE USER '<MYSQL_USER>'@'localhost' IDENTIFIED BY '<MYSQL_PASSWORD>';
GRANT ALL PRIVILEGES ON <MYSQL_DATABASE>.* TO '<MYSQL_USER>'@'localhost';
```

## Dados de exemplo (Flyway)

Para popular o banco com 6 usuários, 12 dúvidas, respostas, curtidas e seguidores, suba o backend uma vez com o perfil `seed`:

```powershell
cd backend
.\gradlew.bat bootRun --args="--spring.profiles.active=dev,seed"
```

Todos os usuários de exemplo usam a senha `Senha123` e entram por e-mail (`ana.exemplo@edu.unifor.br`) ou username (`anabeatriz`). O Flyway guarda o que já aplicou em `flyway_schema_history`, então repetir o comando não duplica nada. Os scripts ficam em `backend/src/main/resources/db/seed`; para novos dados, crie `V2__descricao.sql`, `V3__...` e assim por diante, sem editar os já aplicados.

## Primeiro administrador

Cadastros públicos sempre recebem o papel `USER`. Cadastre a conta por `POST /api/auth/register` e promova-a no Workbench:

```sql
UPDATE users SET role = 'ADMIN' WHERE id = X;
```

Autentique novamente para o novo papel entrar no JWT.

## Testes

```powershell
cd backend
.\gradlew.bat test
```
