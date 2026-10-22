# Companion

Rede social acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. Esta etapa implementa os CRUDs e regras de negócio na API REST em Java 21/Spring Boot, preparados para validação pelo Postman. O frontend foi mantido em seu estado visual original e não está integrado a estes endpoints.

## Funcionalidades

- cadastro e login por e-mail ou username, com JWT de 60 minutos;
- perfis, onboarding opcional, matérias e proficiência autodeclarada;
- feed cronológico paginado, busca e filtro por matéria;
- posts de dúvidas, respostas diretas, curtidas e exclusão lógica;
- perfis públicos e relacionamentos de seguidores;
- denúncias, análise de moderação e preservação do histórico;
- administração de usuários, matérias e FAQ;
- recuperação de senha com token de uso único, hash SHA-256 e expiração em 15 minutos.

O catálogo funcional normativo da versão 1.0 está em [docs/escopo_v1.md](docs/escopo_v1.md). Posts e respostas não podem ser editados. Não há threads, curtidas em respostas, resposta aceita, chat ou recomendação personalizada. O frontend permanece no estado visual original e ainda não está integrado à API; os CRUDs podem ser exercitados pelo Postman.

## Arquitetura

```text
Postman/HTTP -> Controller -> Service -> Repository -> Entity -> MySQL
```

- Backend: Java 21, Spring Boot 4, Spring Security, JWT, Spring Data JPA e Gradle.
- Banco local: MySQL 8.4 via Docker Compose.
- Testes: JUnit, Spring Test e H2 em modo de compatibilidade MySQL.

Os endpoints devem seguir o prefixo `/api`; consulte os Controllers do backend e o catálogo de escopo para os recursos disponíveis.

## Requisitos

- JDK 21;
- Docker Desktop com Docker Compose.
- Postman ou outro cliente HTTP.

## Configuração e execução local

1. Copie `.env.example` para `.env` e substitua todas as senhas e `JWT_SECRET`. O segredo JWT precisa ter pelo menos 32 bytes.
2. Inicie o MySQL na raiz:

```powershell
docker compose up -d
```

3. Inicie a API:

```powershell
cd backend
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

O perfil `dev` registra o link de recuperação no console. Sem esse perfil, configure as variáveis SMTP do `.env`; links nunca são registrados fora de `dev`.

4. No Postman, use a base `http://localhost:8080/api`. Cadastre ou autentique um usuário e envie o token retornado como `Authorization: Bearer <token>` nos endpoints protegidos.

## Primeiro administrador local

Cadastros públicos sempre recebem o papel `USER`. Para iniciar a administração em um banco local novo, cadastre a conta por `POST /api/auth/register` e promova apenas essa conta diretamente no banco:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu-email@unifor.br';
```

Autentique novamente para o novo papel ser incluído no JWT. A partir daí, papéis e status são gerenciados pelos endpoints administrativos.

## Verificação

```powershell
cd backend
.\gradlew.bat test
```

O Hibernate usa `ddl-auto=update` no ambiente MySQL existente e `create-drop` somente nos perfis efêmeros de demonstração/teste.
