# Companion

Companion é uma plataforma web acadêmica para estudantes de Ciência da Computação da Universidade de Fortaleza. O sistema funciona como uma rede de dúvidas: cada post representa uma pergunta associada a uma matéria e pode receber respostas de outros estudantes.

## Escopo atual

- Cadastro público, login e recuperação de senha
- Perfis com biografia, matérias dominadas e matérias que o usuário deseja aprender
- Criação, edição, visualização e exclusão lógica de posts de dúvida
- Respostas aos posts, representadas no domínio por `PostComment`
- Edição de posts e respostas com indicação visível de conteúdo editado
- Uma curtida por usuário em cada resposta, sem permitir autocurtida
- Resposta aceita definida automaticamente pela maior quantidade de curtidas
- Destaque adicional para a resposta do usuário com maior proficiência na matéria
- Feed cronológico com carregamento incremental de 10 posts por página
- Busca paginada de posts e estudantes
- Seguir e deixar de seguir estudantes
- Perfil público com posts e atividade de respostas
- FAQ e administração de usuários, conteúdo e perguntas frequentes
- Onboarding opcional, ignorável e disponível novamente no menu

Em caso de empate nas curtidas, fica em destaque a resposta do usuário com maior proficiência na matéria; persistindo o empate, vence a resposta mais antiga. A proficiência é autodeclarada como `INICIANTE`, `INTERMEDIARIO` ou `AVANCADO`.

## Fora do escopo atual

- Tickets de suporte e contato interno com administradores
- Papel específico de moderador
- Chat em tempo real e mensagens diretas
- Notificações
- Feed com recomendação personalizada
- Grupos, chamadas de voz e compartilhamento de tela
- Uso público do feed sem conta
- Recomendação automática de estudantes
- Layout responsivo e suporte oficial a dispositivos móveis
- Aplicativos nativos

Esses itens ficam registrados como possíveis melhorias futuras.

## Arquitetura

O projeto é um monorepositório com frontend e backend separados:

```text
React → HTTP/JSON → Controller → Service → Repository → Entity → MySQL
```

- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router e Axios
- Backend: Java 21, Spring Boot, Gradle, Spring Security e API REST
- Persistência: Spring Data JPA e Hibernate
- Banco de dados: MySQL
- Autenticação: JWT e senhas com BCrypt
- Infraestrutura local: Docker Compose para o MySQL

O código deve respeitar as camadas descritas em [`docs/GUIA_DESENVOLVIMENTO.md`](docs/GUIA_DESENVOLVIMENTO.md). Controller não acessa Repository diretamente, DTOs são usados na fronteira da API e regras de negócio ficam no Service.

## Regras principais

- `Post` e pergunta são a mesma funcionalidade.
- `PostComment` representa uma resposta ao post.
- A matéria de um post é obrigatória.
- O autor pode editar e excluir logicamente o próprio conteúdo.
- O administrador pode moderar qualquer usuário ou conteúdo.
- Conteúdo editado exibe a indicação `Editado`.
- Usuários suspensos não podem entrar nem publicar; seu conteúdo permanece visível até ser moderado.
- Contas excluídas são anonimizadas e seu conteúdo é preservado para manter o contexto das discussões.
- Contadores de seguidores, posts e respostas são calculados por consulta, não armazenados como colunas.

## Execução local

O projeto será demonstrado e publicado como portfólio para execução local. As credenciais e segredos devem ser configurados por variáveis de ambiente e nunca versionados.

```bash
docker compose up -d
cd backend
./gradlew bootRun
```

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O navegador oficialmente suportado é o Google Chrome no Windows 10 e 11.

## Status

Em desenvolvimento. A base atual contém o esqueleto inicial de usuário, segurança e frontend; os domínios descritos acima ainda precisam ser implementados.
