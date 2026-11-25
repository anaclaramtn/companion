# Companion

Rede social acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. Dúvidas por matéria, respostas, perfis, moderação e painel de denúncias.

- **Backend:** Java 21, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Gradle.
- **Frontend:** React 19, Vite, Tailwind.
- **Banco:** MySQL 8.4.
- **Login:** Firebase Authentication (e-mail e senha, verificação de e-mail e recuperação de senha). Os demais dados ficam no MySQL.
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

   O banco, o usuário e as tabelas são criados automaticamente. Para conseguir entrar no app, [configure o Firebase](#configurar-o-firebase).
3. **Parar:** `docker compose down` (mantém o banco) ou `docker compose down -v` (apaga o banco).

O passo a passo detalhado está no `companion-local.txt` (arquivo privado, fora do Git).

> **Já tinha o projeto rodando antes do login pelo Firebase?** A tabela `users` mudou (saiu `password_hash`, entrou `firebase_uid`) e as migrações V1 e V2 dos dados de exemplo foram editadas. É preciso recriar o banco com `docker compose down -v`, que **apaga todos os dados locais**, e subir de novo com `docker compose up --build`.

## Como o login funciona

1. O frontend faz o login no Firebase e recebe um ID token.
2. Ele envia o token para `POST /api/auth/firebase`.
3. O backend valida o token, exige e-mail verificado e `@edu.unifor.br`, encontra ou cria o usuário no MySQL (coluna `users.firebase_uid`) e devolve o JWT do Companion, usado no restante da API.

No primeiro acesso a API responde 428 até a pessoa aceitar os termos. O login é por e-mail (não por username). O banco não guarda senhas. Excluir a conta no app também a exclui no Firebase; se essa chamada falhar, o log do backend mostra o UID para exclusão manual.

## Configurar o Firebase

Use um projeto **de desenvolvimento**. Os nomes dos menus do console podem mudar um pouco.

1. Em [console.firebase.google.com](https://console.firebase.google.com), crie um projeto. O Google Analytics não é necessário.
2. Em **Authentication**, clique em começar e, em **Sign-in method** (método de login), ative só **E-mail/senha** (sem o link por e-mail).
3. Em **Authentication > Settings** (configurações):
   - **Authorized domains:** adicione `localhost` (projetos novos não o incluem) e, em produção, o domínio do frontend;
   - **User account linking:** mantenha uma conta por endereço de e-mail;
   - **User actions:** confira se a proteção contra enumeração de e-mails está ativa;
   - **Password policy:** exija no mínimo 8 e no máximo 72 caracteres, com maiúscula, minúscula e número, no modo que obriga o cumprimento (*Require*).
4. Em **Authentication > Templates**, revise os e-mails de verificação e de redefinição de senha, em português. Se o modelo permitir editar o texto, oriente a ignorar a mensagem quem não pediu.
5. Em **Configurações do projeto > Geral > Seus apps**, adicione um app **Web** (ícone `</>`; não precisa de Hosting). Copie do objeto `firebaseConfig` para o `.env`:

   | `firebaseConfig` | Variável |
   |---|---|
   | `apiKey` | `VITE_FIREBASE_API_KEY` |
   | `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `VITE_FIREBASE_PROJECT_ID` |
   | `appId` | `VITE_FIREBASE_APP_ID` |

6. Em **Configurações do projeto > Contas de serviço**, clique em **Gerar nova chave privada** e salve o JSON **fora da pasta do projeto**. Converta para Base64 direto para a área de transferência (PowerShell):

   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\caminho\da\chave.json")) | Set-Clipboard
   ```

   Cole em `FIREBASE_SERVICE_ACCOUNT_BASE64` no `.env`. Essa chave dá acesso administrativo ao Firebase: não a envie por chat, não a coloque no Git e, se vazar, exclua-a no console e gere outra.
7. Rode `docker compose up --build`. Rodando o frontend fora do Docker, copie as variáveis `VITE_*` para `frontend/.env.local` (modelo em `frontend/.env.example`) e execute `npm install`.

**Produção:** defina as variáveis `VITE_FIREBASE_*` na Vercel (antes do build) e `FIREBASE_SERVICE_ACCOUNT_BASE64` na hospedagem do backend.

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

Para entrar com eles, defina também `SEED_USER_PASSWORD` no `.env`: ao subir, o backend cria essas contas no Firebase, já verificadas, com essa senha (use só em um projeto de desenvolvimento). O login é pelo e-mail, como `ana.exemplo@edu.unifor.br`. Se a conta já existir no Firebase, a senha dela não é alterada. Quem já aplicou as anteriores recebe só as novas, e repetir o comando não duplica nada. As fotos da V2 são avatares ilustrados gravados no próprio SQL; o endereço delas é gravado só como caminho (a V4 ajusta quem já aplicou a V2) e a API completa com o próprio endereço ao responder.

## Primeiro administrador

Cadastros públicos sempre recebem o papel `USER`. Cadastre a conta pelo app (com e-mail `@edu.unifor.br`), confirme o e-mail, entre uma vez e promova-a no banco:

```powershell
docker compose exec db mysql -u<MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE> -e "UPDATE users SET role='ADMIN' WHERE id=X;"
```

Entre de novo para o papel valer no token.
