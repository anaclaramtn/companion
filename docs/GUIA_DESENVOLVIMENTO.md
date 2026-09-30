# Guia de desenvolvimento do Companion

Este guia define a arquitetura, o modelo de domínio e as convenções vigentes do Companion. Ele deve ser atualizado sempre que uma decisão estrutural do projeto mudar.

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

O backend é um monólito organizado em camadas. Cada camada possui uma responsabilidade específica:

- **Entity**: representa os dados persistidos no banco e seus relacionamentos JPA.
- **DTO**: define os dados que entram e saem da API. DTOs evitam expor diretamente as Entities.
- **Repository**: concentra o acesso ao banco por meio do Spring Data JPA.
- **Service**: concentra regras de negócio, validações e a coordenação das operações.
- **Controller**: recebe requisições HTTP, chama o Service e devolve respostas da API.
- **Security**: implementa Spring Security, JWT, BCrypt e autorização por papel.
- **Exception**: reúne exceções e tratamentos padronizados para erros da aplicação.
- **Config**: contém configurações gerais e beans necessários para o funcionamento do sistema.
- **Enum**: concentra valores fechados e estados definidos pelo domínio da aplicação.

O Controller não deve acessar o Repository diretamente. A comunicação deve passar pelo Service, e regras de negócio não devem ficar no React nem no Controller.

## B) Modelo de domínio vigente

`Post` e pergunta são a mesma funcionalidade. Todo post é uma dúvida acadêmica associada a uma matéria. `PostComment` representa uma resposta à dúvida; não existem entidades separadas chamadas `Question` ou `Answer`.

Entidades previstas:

```text
User
Subject
UserSubject
Follow
Post
PostComment
CommentLike
Faq
PasswordResetToken
```

Relacionamentos principais:

```text
User 1:N Post
Subject 1:N Post
Post 1:N PostComment
User 1:N PostComment
PostComment 1:N CommentLike
User 1:N CommentLike
User N:N Subject, por UserSubject
User N:N User, por Follow
```

`UserSubject` registra se o estudante domina ou deseja aprender uma matéria e guarda a proficiência autodeclarada: `INICIANTE`, `INTERMEDIARIO` ou `AVANCADO`.

`CommentLike` deve possuir uma restrição única para o par `user_id` e `post_comment_id`. O autor não pode curtir a própria resposta.

## C) Ordem para implementar uma funcionalidade

Siga esta sequência para manter o trabalho previsível:

1. Entender o requisito
2. Definir ou alterar o modelo de dados
3. Criar a Entity
4. Criar os DTOs
5. Criar o Repository
6. Criar o Service
7. Criar o Controller
8. Testar o endpoint
9. Criar o service Axios no frontend
10. Criar a página e os componentes
11. Integrar frontend e backend
12. Testar o fluxo completo

## D) Exemplo User

`User` é apenas o exemplo de referência da estrutura inicial. Ele não representa uma funcionalidade completa.

- `entities/User.java`: representa a entidade `User` e seu identificador persistido pelo JPA.
- `dtos/user/UserRequestDTO.java`: define os dados esperados quando um usuário for enviado para a API.
- `dtos/user/UserResponseDTO.java`: define os dados que poderão ser devolvidos ao frontend, sem expor informações sensíveis.
- `repositories/UserRepository.java`: estende `JpaRepository` e será o ponto de acesso aos dados de `User`.
- `services/UserService.java`: recebe o `UserRepository` por injeção de dependência e será responsável pelas regras de usuário.
- `controllers/UserController.java`: recebe o `UserService` e será o ponto de entrada HTTP dos usuários.

A comunicação entre os arquivos segue este padrão:

```text
Frontend
   ↓ HTTP/JSON
UserController
   ↓
UserService
   ↓
UserRepository
   ↓
User Entity
   ↓
MySQL
```

Na volta, os dados percorrem o caminho inverso e são transformados em JSON:

```text
MySQL
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓ JSON
Frontend
```

Ao criar outra camada de domínio, repita a mesma separação e mantenha cada responsabilidade no local correto.

## E) Como criar uma nova funcionalidade

Considere a criação de posts. O desenvolvedor deve seguir o mesmo padrão de `User`:

```text
Post.java
PostRequestDTO.java
PostResponseDTO.java
PostRepository.java
PostService.java
PostController.java
postService.js
página/componente React
```

Posts e respostas também exigem `PostComment`, `CommentLike`, seus DTOs, repositories, services e controllers. Primeiro, o requisito e o modelo de dados devem ser entendidos; depois, a implementação avança do backend para o frontend.

## F) Relacionamentos JPA

Relacionamentos devem ser definidos primeiro no modelo de dados, antes de serem implementados nas Entities. A escolha depende da cardinalidade e da responsabilidade de cada lado:

- `@OneToOne`: uma entidade se relaciona com exatamente uma outra. Exemplo: um usuário e um perfil complementar, caso o domínio exija essa separação.
- `@OneToMany`: uma entidade possui vários registros relacionados. Exemplo: um `User` possui vários `Post`.
- `@ManyToOne`: vários registros apontam para uma entidade. Exemplo: vários `PostComment` pertencem a um `Post`.
- Relacionamentos N:N devem usar entidade associativa quando possuírem dados próprios, como `UserSubject`, `Follow` e `CommentLike`.

Em um banco relacional, a **PK (Primary Key)** identifica unicamente cada registro. A **FK (Foreign Key)** guarda a referência à PK de outra tabela.

Exemplos de relacionamentos esperados no Companion:

- `User 1:N Post`
- `Subject 1:N Post`
- `Post 1:N PostComment`
- `User 1:N PostComment`
- `PostComment 1:N CommentLike`

Antes de adicionar anotações como `@OneToMany` ou `@ManyToOne`, defina a entidade dona, as chaves e a exposição dos dados nos DTOs.

## G) Regras do produto

- Posts e respostas podem ser editados; depois da primeira alteração, a API devolve `edited: true` e a interface mostra `Editado`.
- A exclusão de posts e respostas é lógica, usando `deletedAt` ou estado equivalente.
- O autor altera ou exclui apenas o próprio conteúdo; o administrador pode moderar qualquer conteúdo.
- A resposta aceita é calculada pela maior quantidade de curtidas.
- Em empate de curtidas, vence a resposta do usuário com maior proficiência na matéria; persistindo o empate, vence a resposta mais antiga.
- A resposta do usuário mais proficiente recebe um selo próprio, mesmo quando não for a mais curtida.
- Contadores são calculados por consultas `COUNT`, evitando dados duplicados.
- O cadastro é público, sem aprovação. A vinculação à Unifor é declarada pelo usuário e não é verificada por integração externa.
- Usuários podem estar `ACTIVE`, `SUSPENDED` ou `DELETED`.
- Usuário suspenso não autentica nem publica; seu conteúdo permanece até decisão administrativa.
- Usuário excluído é anonimizado, perde o acesso e tem o conteúdo preservado para manter o contexto.
- A moderação é administrativa direta; não haverá denúncias nesta versão.

## H) Feed, busca, perfil e onboarding

O feed apresenta os posts mais recentes e retorna páginas de 10 registros. O frontend carrega a página seguinte quando o usuário se aproxima do fim da lista.

A busca possui duas categorias:

- **Posts:** título, descrição e matéria, com paginação e filtro opcional por matéria.
- **Estudantes:** nome, biografia e matérias dominadas ou desejadas.

A primeira versão usa busca parcial sem diferenciação de maiúsculas e minúsculas. Busca semântica, recomendação e ranking avançado ficam fora do escopo.

O perfil público apresenta foto, nome, biografia, matérias, proficiência autodeclarada, posts e atividade de respostas. As quantidades de posts, respostas, seguidores e usuários seguidos são calculadas pela API.

O onboarding é opcional: pode ser pulado, fica marcado como concluído e pode ser aberto novamente pelo menu.

## I) Autenticação e recuperação de senha

- Spring Security com autenticação stateless.
- JWT de acesso com duração de 60 minutos e sem refresh token na primeira versão.
- Senhas armazenadas com BCrypt.
- Autorização por `USER` e `ADMIN`.
- Segredos, chave JWT e credenciais SMTP somente em variáveis de ambiente.
- CORS limitado ao endereço local do frontend.
- Respostas de recuperação não revelam se um e-mail existe.

Na recuperação, o backend gera um token UUID de uso único, válido por 15 minutos, e envia um link por e-mail com Spring Mail. Para a apresentação local, um perfil `dev` pode registrar o link no console; esse comportamento não deve ser habilitado em produção.

## J) Estrutura recomendada

Backend:

```text
backend/src/main/java/com/companion/
├── config/
├── controllers/
├── dtos/
│   ├── auth/
│   ├── user/
│   ├── post/
│   ├── comment/
│   ├── subject/
│   ├── search/
│   ├── faq/
│   └── admin/
├── entities/
├── enums/
├── exceptions/
├── repositories/
├── security/
├── services/
└── BackendApplication.java
```

Frontend:

```text
frontend/src/
├── api/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── pages/
│   ├── auth/
│   ├── feed/
│   ├── posts/
│   ├── profile/
│   ├── search/
│   ├── faq/
│   └── admin/
├── routes/
├── services/
├── styles/
├── App.jsx
└── main.jsx
```

Utilize React com JavaScript, React Router, Axios e somente Tailwind CSS. Bootstrap não faz parte da arquitetura.

## K) Ordem de implementação do produto

1. Completar `User`, autenticação JWT e papéis.
2. Implementar `Subject` e `UserSubject`.
3. Implementar `Post`, edição e exclusão lógica.
4. Implementar `PostComment` e `CommentLike`.
5. Implementar resposta aceita e selo de proficiência.
6. Implementar perfis e `Follow`.
7. Implementar feed paginado e busca.
8. Implementar FAQ e administração.
9. Implementar recuperação de senha e onboarding.
10. Integrar o frontend e executar os testes completos.

## L) Requisitos técnicos e testes

- Chrome no Windows 10 e 11 é o ambiente oficialmente suportado.
- Layout responsivo fica como melhoria futura.
- Operações comuns devem responder em até 2 segundos; pesquisas, em até 3 segundos no ambiente local.
- O MySQL roda localmente pelo Docker Compose.
- Testes obrigatórios: unitários de Services, integração de repositories, API/controllers, frontend e fluxo completo.

## M) Convenções

- Use classes Java em `PascalCase`.
- Use métodos e variáveis em `camelCase`.
- Use endpoints REST em minúsculo, como `/api/users`.
- Mantenha DTOs separados das Entities.
- Não permita que Controller acesse Repository diretamente.
- Coloque regras de negócio no Service.
- Coloque acesso ao banco no Repository.
- Nunca retorne senha em `ResponseDTO`.
- Nunca retorne hash de senha ou token de recuperação em DTOs públicos.
- Não coloque regra de negócio no React.
- Não faça commit de arquivos `.env`.
- Não faça commit de `node_modules`, `build`, `.gradle` ou `.idea`.

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

Ao finalizar, abra um Pull Request para a branch `main`. Descreva o que foi feito, informe como testar e aguarde a revisão antes do merge.

## O) Itens em espera

Tickets de suporte, contato interno com administradores, responsividade, chat, notificações, recomendação personalizada, grupos, chamadas, compartilhamento de tela e papel de moderador não fazem parte da primeira versão.
