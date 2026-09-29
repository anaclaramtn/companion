# Guia de desenvolvimento

Este guia define o padrão inicial de trabalho do Companion para os quatro integrantes da equipe. O objetivo é manter as responsabilidades separadas e facilitar a evolução colaborativa do projeto.

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
- **Security**: concentra as configurações de segurança e, futuramente, autenticação e autorização.
- **Exception**: reúne exceções e tratamentos padronizados para erros da aplicação.
- **Config**: contém configurações gerais e beans necessários para o funcionamento do sistema.
- **Enum**: concentra valores fechados e estados definidos pelo domínio da aplicação.

O Controller não deve acessar o Repository diretamente. A comunicação deve passar pelo Service.

## B) Ordem para implementar uma funcionalidade

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

## C) Exemplo User

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

## D) Como criar uma nova funcionalidade

Considere a criação de posts como exemplo conceitual. O desenvolvedor deve seguir o mesmo padrão de `User`:

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

Primeiro, o requisito e o modelo de dados devem ser entendidos. Depois, a implementação deve avançar do backend para o frontend, respeitando a ordem da seção B. Os arquivos de `Post` acima são apenas um exemplo de organização e não estão sendo criados nesta etapa.

## E) Relacionamentos JPA

Relacionamentos devem ser definidos primeiro no modelo de dados, antes de serem implementados nas Entities. A escolha depende da cardinalidade e da responsabilidade de cada lado:

- `@OneToOne`: uma entidade se relaciona com exatamente uma outra. Exemplo: um usuário e um perfil complementar, caso o domínio exija essa separação.
- `@OneToMany`: uma entidade possui vários registros relacionados. Exemplo: um `User` possui vários `Post`.
- `@ManyToOne`: vários registros apontam para uma entidade. Exemplo: vários `Answer` pertencem a uma `Question`.
- `@ManyToMany`: vários registros de um lado se relacionam com vários do outro. Exemplo possível: posts associados a várias tags e cada tag associada a vários posts.

Em um banco relacional, a **PK (Primary Key)** identifica unicamente cada registro. A **FK (Foreign Key)** guarda a referência à PK de outra tabela.

Exemplos de relacionamentos esperados no Companion:

- `User 1:N Post`
- `User 1:N Question`
- `Question 1:N Answer`
- `Post 1:N Comment`

Antes de adicionar anotações como `@OneToMany` ou `@ManyToOne`, combine com a equipe qual entidade será a dona do relacionamento, quais serão as chaves e como os dados serão expostos nos DTOs.

## F) Convenções

- Use classes Java em `PascalCase`.
- Use métodos e variáveis em `camelCase`.
- Use endpoints REST em minúsculo, como `/api/users`.
- Mantenha DTOs separados das Entities.
- Não permita que Controller acesse Repository diretamente.
- Coloque regras de negócio no Service.
- Coloque acesso ao banco no Repository.
- Nunca retorne senha em `ResponseDTO`.
- Não coloque regra de negócio no React.
- Não faça commit de arquivos `.env`.
- Não faça commit de `node_modules`, `build`, `.gradle` ou `.idea`.

## G) Git

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
