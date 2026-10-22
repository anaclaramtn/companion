# Guia de desenvolvimento do Companion

O escopo funcional único da versão 1.0 está consolidado em
[`escopo_v1.md`](escopo_v1.md). Use-o como catálogo normativo de
funcionalidades, junto deste guia para arquitetura/regras e de
[`modelo-entidades.puml`](modelo-entidades.puml) para o modelo persistente.
`documento_projeto.md` e `historias_usuario.md` mantêm contexto e detalhes
históricos, mas não podem ampliar o escopo consolidado. Uma funcionalidade
marcada como fora de escopo em `escopo_v1.md` não deve ser implementada com
base em uma história antiga.

Este guia define a arquitetura, o modelo de domínio e as convenções vigentes
do Companion. As decisões detalhadas do modelo estão em
[`modelo-entidades.puml`](modelo-entidades.puml), e as regras funcionais estão
em [`escopo_v1.md`](escopo_v1.md). O contrato-alvo de usuários segue a seção D
deste guia até que um documento específico de contrato seja criado.

Quando documentos divergirem, prevalecem `escopo_v1.md`, este guia e o modelo
PUML, nessa ordem para escopo funcional, arquitetura/regras e estrutura de
dados. README e histórias de usuário são referências derivadas e devem ser
atualizados quando houver mudança nesses documentos; histórias antigas ajudam
a detalhar interface somente onde forem compatíveis com a versão 1.0.

## A) Arquitetura

O fluxo principal da aplicação é:

```text
Frontend React
      ↓ HTTP/JSON
Controller
      ↓
Service
      ↓
Repository
      ↓
Entity
      ↓
MySQL
```

O backend é um monólito organizado em camadas:

- **Entity:** representa os dados persistidos e seus relacionamentos JPA.
- **DTO:** define contratos específicos de entrada e saída sem expor Entities.
- **Repository:** concentra o acesso ao banco com Spring Data JPA.
- **Service:** concentra casos de uso, regras, autorização e transações.
- **Controller:** mapeia HTTP, valida DTOs e delega ao Service.
- **Security:** implementa Spring Security, JWT, BCrypt e autorização por papel.
- **Exception:** reúne erros da aplicação e seu tratamento HTTP padronizado.
- **Enum:** concentra estados e outros valores fechados do domínio.

O Controller não acessa o Repository diretamente. Regras de negócio não ficam
no Controller nem no React. O frontend valida para melhorar a experiência, mas
o backend sempre repete as validações que protegem o domínio.

Uma pasta `config` só deve ser criada quando houver uma configuração geral
real, como CORS separado, OpenAPI ou serialização. Configurações de segurança
permanecem em `security`.

## B) Modelo de domínio vigente

`Post` e pergunta representam a mesma funcionalidade. Todo post é uma dúvida
acadêmica associada a uma matéria. `PostComment` representa somente uma resposta
direta ao post; não existem `Question`, `Answer` nem respostas em thread na
primeira versão.

Entidades previstas:

```text
User
Subject
UserSubject
Post
PostComment
PostLike
Follow
Report
Faq
PasswordResetToken
```

Relacionamentos principais:

```text
User 1:N Post
Subject 1:N Post
Post 1:N PostComment
User 1:N PostComment
User N:N Subject, por UserSubject
User N:N Post, por PostLike
User N:N User, por Follow
User 1:N Report, como denunciante
User 1:N Report, como revisor
Post 1:N Report, quando o post é o alvo
PostComment 1:N Report, quando a resposta é o alvo
User 1:N PasswordResetToken
```

Regras estruturais importantes:

- `User` reúne conta, autenticação e perfil essencial; não existe entidade
  `Profile` sem ciclo de vida independente.
- `UserSubject` guarda `interestType` (`DOMINA` ou `QUER_APRENDER`) e
  `proficiency` (`INICIANTE`, `INTERMEDIARIO` ou `AVANCADO`), com uma combinação
  única de usuário e matéria.
- `PostLike` representa curtidas em posts, com unicidade para `user_id` e
  `post_id`. Respostas não recebem curtidas nesta versão.
- `Follow` é direcionado, não permite auto-seguimento e mantém uma combinação
  única de seguidor e seguido.
- `Report` aponta para exatamente um alvo: um `Post` ou um `PostComment`. Criar
  uma denúncia não remove o conteúdo automaticamente.
- `PasswordResetToken` guarda somente o hash SHA-256 do token, expira em 15
  minutos e tem uso único.
- `Faq` é conteúdo global e não precisa de FK para o administrador que o edita.

As tabelas e cardinalidades estão em
[`modelo-entidades.puml`](modelo-entidades.puml). Não adicione uma entidade ou
relacionamento sem antes atualizar o modelo e verificar cardinalidade, ciclo de
vida e regras de exclusão.

## C) Ordem para implementar uma funcionalidade

Siga esta sequência:

1. entender o requisito e confirmar se pertence ao escopo;
2. definir ou alterar o modelo e suas restrições;
3. criar ou atualizar a Entity e os Enums;
4. criar DTOs específicos de entrada e saída;
5. criar o Repository e somente as consultas necessárias;
6. implementar regras e transações no Service;
7. expor o caso de uso no Controller;
8. criar testes unitários e de integração do backend;
9. criar ou atualizar o módulo HTTP em `frontend/src/services`;
10. criar a página e os componentes necessários;
11. integrar frontend e backend;
12. testar o fluxo completo e os casos de erro.

Não crie pastas, DTOs, repositories ou services antecipadamente. Cada arquivo
deve surgir junto de uma necessidade concreta.

## D) Referência de implementação: User

`User` é a primeira referência do padrão em camadas, mas o código inicial ainda
precisa seguir os contratos de usuário descritos nesta seção e em
`escopo_v1.md`.

Arquivos e responsabilidades esperados:

- `entities/User.java`: conta, credencial e dados essenciais do perfil.
- `dtos/user/UserRegistrationRequestDTO.java`: somente e-mail e senha para o
  cadastro público.
- `dtos/user/UserProfileUpdateRequestDTO.java`: campos editáveis da própria
  conta e do perfil; nunca recebe papel, status ou datas de auditoria.
- `dtos/user/UserPublicResponseDTO.java`: somente dados visíveis no perfil de
  outro estudante.
- `dtos/user/UserAccountResponseDTO.java`: dados privados necessários ao titular.
- `repositories/UserRepository.java`: persistência e consultas de unicidade.
- `services/UserService.java`: normalização, unicidade, conclusão do perfil,
  autorização e anonimização.
- `controllers/UserController.java`: cadastro, perfil público e operações da
  própria conta.
- fluxo administrativo de usuários: suspensão, reativação e exclusão de contas
  sob `/api/admin/users`; pode reutilizar `UserService` enquanto isso mantiver
  responsabilidades claras.

O cadastro recebe apenas e-mail e senha. Nome e username começam nulos e devem
ser definidos antes do acesso ao feed. Matrícula e curso são opcionais;
matrícula só é mantida quando informada. Semestre é opcional no perfil, mas
obrigatório quando a pessoa optar por informá-lo/exibi-lo.

E-mail e username são comparados sem diferença entre maiúsculas e minúsculas;
username é armazenado em minúsculas e sem `@`. Senhas usam BCrypt e nunca são
retornadas. Contas novas recebem `USER` e `ACTIVE`.

A comunicação continua seguindo o fluxo padrão:

```text
HTTP/JSON -> UserController -> UserService -> UserRepository -> User -> MySQL
```

Na resposta, o Service converte a Entity para o DTO apropriado ao público. Um
endpoint de perfil nunca deve devolver e-mail, matrícula, hash de senha ou
estado privado do onboarding.

## E) Como criar uma nova funcionalidade

Para criar posts, por exemplo, implemente somente os arquivos necessários ao
caso de uso:

```text
Post.java
PostCreateRequestDTO.java
PostResponseDTO.java
PostRepository.java
PostService.java
PostController.java
postService.js
página/componente React
```

Curtidas em posts exigem `PostLike`; respostas diretas exigem `PostComment`;
denúncias de posts ou respostas exigem `Report`. Cada domínio recebe DTO,
Repository, Service e Controller próprios apenas quando houver uma operação
real que os utilize.

Posts e respostas podem ser criados, consultados e excluídos logicamente, mas
não editados depois da publicação. Portanto, não crie DTO ou endpoint de edição
para esses conteúdos no protótipo inicial.

## F) Relacionamentos JPA

Defina relacionamentos primeiro no modelo de dados. A anotação JPA decorre da
cardinalidade e da responsabilidade de cada lado:

- `@OneToMany`: uma entidade se relaciona com vários registros. Exemplo: um
  `Post` pode ter várias respostas.
- `@ManyToOne`: vários registros apontam para uma entidade. Exemplo: vários
  `PostComment` pertencem a um `Post`.
- relações N:N com regras ou dados próprios usam uma Entity associativa, como
  `UserSubject`, `PostLike` e `Follow`, em vez de `@ManyToMany` direto.

Em banco relacional, a **PK (Primary Key)** identifica cada registro e a **FK
(Foreign Key)** referencia a PK de outra tabela. Restrição de domínio que cabe
no banco deve também ser expressa por `NOT NULL`, `UNIQUE`, `CHECK` ou FK,
quando compatível com MySQL e JPA.

Cuidados obrigatórios:

- não exponha grafos JPA diretamente nos Controllers;
- prefira consultas e DTOs explícitos a depender de serialização de relações;
- evite carregamento `EAGER` de coleções sem necessidade medida;
- use transação no Service quando um caso de uso altera mais de um registro;
- não use `CascadeType.REMOVE` em relações cujo histórico deve ser preservado;
- exclusão lógica de usuário, post e resposta não deve apagar discussões em
  cascata.

Antes de anotar ambos os lados de uma relação, confirme se a navegação
bidirecional é realmente necessária. Uma associação unidirecional costuma ser
mais simples e reduz risco de recursão na serialização.

## G) Regras do produto

- Posts e respostas não podem ser editados depois da publicação no protótipo.
- A exclusão de posts e respostas é lógica, usando `deletedAt`.
- O autor pode excluir o próprio conteúdo; moderador e administrador podem
  excluir ou moderar qualquer post ou resposta.
- Curtidas existem apenas em posts. Cada usuário pode curtir o mesmo post uma
  vez; remover a curtida pode apagar fisicamente `PostLike`.
- Não existe resposta aceita automática nem selo por proficiência nesta versão.
- Respostas são diretas ao post e não formam threads.
- Posts e respostas usam `TEXT`, com limite de 300 caracteres para cada
  conteúdo; `Ver mais` é apenas comportamento visual.
- Uma matéria associada a qualquer usuário ou post não pode ser excluída.
- Denúncias de posts e respostas são mantidas. O autor não denuncia o próprio
  conteúdo e cada usuário denuncia o mesmo alvo uma única vez.
- Denunciar não oculta nem exclui o alvo. Moderador ou administrador analisa a
  denúncia como `RESOLVED` ou `DISMISSED`.
- Contadores são calculados por consultas `COUNT`, sem colunas duplicadas.
- O cadastro é público, sem aprovação. O vínculo com a Unifor é declaratório e
  não possui integração externa de verificação.
- Contas usam os estados `ACTIVE`, `SUSPENDED` e `DELETED`.
- Conta suspensa não autentica nem publica; seu conteúdo permanece disponível
  enquanto aguarda decisão administrativa.
- Conta excluída é anonimizada, perde acesso e mantém posts e respostas para
  preservar o contexto.
- Papéis são `USER`, `MODERATOR` e `ADMIN`. Moderadores cuidam de denúncias e
  conteúdo; administradores também gerenciam contas e FAQ.

## H) Feed, busca, perfil e onboarding

O feed apresenta os posts mais recentes e retorna páginas de 10 registros. O
frontend carrega a página seguinte quando o usuário se aproxima do fim da
lista.

A busca possui duas categorias:

- **Posts:** título, conteúdo e matéria, com paginação e filtro opcional por
  matéria.
- **Estudantes:** nome, biografia e matérias dominadas ou desejadas.

A primeira versão usa busca parcial sem diferenciação de maiúsculas e
minúsculas. Busca semântica, recomendação e ranking avançado ficam fora do
escopo.

O perfil público apresenta avatar, nome, username, biografia, matérias,
proficiência autodeclarada, posts e atividade de respostas. Quantidades de
posts, respostas, seguidores e seguidos são calculadas pela API. Dados privados
da conta usam um DTO separado.

Cadastro, conclusão do perfil e onboarding são estados diferentes:

1. o cadastro cria a conta somente com e-mail e senha;
2. nome e username são obrigatórios antes do acesso ao feed;
3. o onboarding de uso da plataforma é opcional, pode ser concluído ou pulado;
4. `onboardingCompletedAt = null` indica que o onboarding está pendente;
5. o conteúdo do onboarding pode ser aberto novamente pelo menu sem apagar a
   data de sua primeira conclusão.

## I) Autenticação, autorização e recuperação de senha

- Spring Security usa autenticação stateless.
- JWT de acesso dura 60 minutos e não há refresh token na primeira versão.
- Senhas são armazenadas com BCrypt.
- Autorização considera `USER`, `MODERATOR` e `ADMIN`.
- Somente o cadastro é público entre os endpoints do CRUD de usuários.
- Segredos, chave JWT e credenciais SMTP ficam em variáveis de ambiente.
- CORS deve permitir apenas as origens configuradas para cada ambiente.
- Respostas de recuperação não revelam se determinado e-mail existe.
- Conta `SUSPENDED` ou `DELETED` não pode autenticar.

Na recuperação, o backend gera um segredo imprevisível de uso único, envia o
link por e-mail e persiste somente seu hash SHA-256 em
`PasswordResetToken`. O token é válido por 15 minutos; ao emitir um novo, tokens
anteriores ainda válidos podem ser invalidados.

Para demonstração local, um perfil de desenvolvimento pode registrar o link no
console. Esse comportamento nunca deve ser habilitado em produção e nenhum
token deve aparecer em DTO público.

## J) Estrutura recomendada

Backend:

```text
backend/
├── gradle/wrapper/
├── src/
│   ├── main/
│   │   ├── java/com/companion/
│   │   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   │   └── <dominio>/
│   │   │   ├── entities/
│   │   │   ├── enums/
│   │   │   ├── exceptions/
│   │   │   ├── repositories/
│   │   │   ├── security/
│   │   │   ├── services/
│   │   │   └── BackendApplication.java
│   │   └── resources/
│   └── test/
│       ├── java/com/companion/
│       └── resources/
├── build.gradle
├── settings.gradle
├── gradlew
└── gradlew.bat
```

Subpastas de `dtos` são criadas somente quando possuírem arquivos reais. A
pasta opcional `config` também não deve existir enquanto estiver vazia.

Frontend:

```text
frontend/src/
├── assets/
├── components/
│   ├── common/
│   └── layout/
├── contexts/
├── pages/
│   ├── auth/
│   ├── feed/
│   ├── posts/
│   ├── profile/
│   ├── search/
│   ├── faq/
│   └── admin/
├── services/
├── styles/
├── App.jsx
└── main.jsx
```

Regras da estrutura do frontend:

- `services` é o único local de acesso HTTP; não mantenha uma pasta `api`
  paralela.
- layouts compartilhados ficam em `components/layout`, não em `layouts`.
- `contexts` recebe inicialmente apenas o estado global de autenticação.
- hooks específicos ficam próximos da página; crie `hooks/` comum somente após
  existir reutilização real.
- poucas rotas podem ficar em `App.jsx`; extraia `routes/` apenas quando o
  arquivo crescer o suficiente para justificar.
- subpastas são criadas junto do primeiro arquivo real, sem `.gitkeep` apenas
  para antecipar a árvore final.

Use React com JavaScript, Vite, React Router, Axios e Tailwind CSS. Bootstrap e
TypeScript não fazem parte da arquitetura atual.

## K) Ordem de implementação do produto

1. adequar `User` ao cadastro em duas etapas, perfil, estados e papéis;
2. implementar autenticação JWT, autorização e DTOs público/privado/admin;
3. implementar `Subject` e `UserSubject`;
4. implementar `Post`, exclusão lógica e `PostLike`;
5. implementar respostas diretas com `PostComment`;
6. implementar perfis públicos e `Follow`;
7. implementar feed paginado e busca;
8. implementar `Report` e o fluxo de moderação;
9. implementar FAQ e gestão administrativa;
10. implementar recuperação de senha e onboarding;
11. integrar o frontend e executar os testes completos.

Essa ordem indica dependências, não autoriza criar antecipadamente todos os
arquivos ou pastas das etapas seguintes.

## L) Requisitos técnicos e testes

- Chrome no Windows 10 e 11 é o ambiente oficialmente suportado.
- Layout responsivo e suporte oficial a dispositivos móveis ficam como melhoria
  futura.
- Operações comuns devem responder em até 2 segundos e pesquisas em até 3
  segundos no ambiente local.
- MySQL roda localmente pelo Docker Compose.
- O perfil `demo` usa H2 em memória para demonstração; dados são descartados ao
  encerrar a aplicação.
- Testes não devem depender do MySQL nem de segredos de desenvolvimento.
- São obrigatórios testes unitários de Services, integração de Repositories,
  API/Controllers, frontend e fluxos principais de ponta a ponta.

Casos críticos incluem unicidade, autorização por papel, conta suspensa,
anonimização, exclusão lógica, curtida única, auto-seguimento, denúncia de alvo
único e expiração/uso único de token de recuperação.

## M) Convenções

- Use classes Java em `PascalCase` e métodos/variáveis em `camelCase`.
- Use endpoints REST em minúsculo, como `/api/users`.
- Use nomes de coluna em `snake_case` no banco e nomes Java em `camelCase`.
- Mantenha DTOs separados das Entities e específicos para cada público.
- Não permita que Controller acesse Repository diretamente.
- Coloque regras, autorização de domínio e transações no Service.
- Coloque acesso ao banco no Repository.
- Normalize e-mail e username antes de verificar unicidade.
- Nunca retorne senha, hash de senha ou token de recuperação.
- Não registre credenciais, JWTs ou tokens em logs de produção.
- Não coloque regra de negócio no React.
- Não faça commit de arquivos `.env` ou segredos.
- Não faça commit de `node_modules`, `build`, `.gradle` ou `.idea`.
- Prefira respostas de erro no formato único de `ApiErrorDTO`, tratadas pelo
  `GlobalExceptionHandler`.

## N) Git

Cada funcionalidade deve ser desenvolvida em uma branch própria:

```bash
git checkout -b feature/nome-da-feature
```

Depois de implementar e testar:

```bash
git add .
git commit -m "feat: descrição"
git push -u origin feature/nome-da-feature
```

Ao finalizar, abra um Pull Request para `main`. Descreva o que foi feito, como
testar, decisões ou migrações necessárias e aguarde a revisão antes do merge.

## O) Itens fora da versão 1.0

- edição de posts e respostas;
- respostas em thread e `parent_comment_id`;
- curtidas em respostas, resposta aceita e selo por proficiência;
- login/cadastro com Google e contas de provedor externo;
- imagens em posts, tags livres, itens salvos e persistência de compartilhamento;
- trabalho, empregador, redes sociais, pontuação, sequência de login, verificação
  acadêmica e algoritmo de reputação no perfil;
- chat, notificações, bloqueios, grupos, chamadas e compartilhamento de tela;
- tickets de suporte e contato interno com administradores;
- recomendação personalizada, busca semântica e ranking avançado;
- layout responsivo e suporte oficial a dispositivos móveis.

## P) Decisões confirmadas pela equipe

- Matrícula e curso são campos opcionais; matrícula só é mantida quando
  informada. Semestre é opcional, mas obrigatório quando a pessoa optar por
  informá-lo/exibi-lo no perfil. Não há verificação acadêmica.
- Google OAuth não será implementado na versão 1.0.
- Posts e respostas usam `TEXT`, com limite de validação de 300 caracteres
  para ambos.
- Matéria associada a qualquer usuário ou post não pode ser excluída.
- Motivos iniciais de denúncia: `SPAM`, `FORA_DO_TEMA`,
  `CONTEUDO_INADEQUADO` e `OUTRO`.

Se uma decisão for alterada, atualize primeiro `escopo_v1.md`, este guia, o
diagrama e os contratos afetados. Depois, altere o código e os testes.
