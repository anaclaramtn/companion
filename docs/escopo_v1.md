# Companion — escopo funcional consolidado da versão 1.0

Este documento consolida o escopo funcional vigente do Companion. Deve ser
usado em conjunto com `guia_desenvolvimento.md` e `modelo-entidades.puml`.
Quando uma descrição antiga divergir daqui, prevalece este escopo consolidado,
que incorpora as decisões vigentes do guia. As histórias de usuário preservam
detalhes de interface e critérios históricos, mas não reintroduzem funções
explicitamente fora da versão 1.0.

## Visão geral

O Companion é uma aplicação web de colaboração acadêmica para estudantes de
Ciência da Computação da Universidade de Fortaleza. O cadastro é público, sem
aprovação ou verificação externa da matrícula. A versão 1.0 permite criar e
consultar dúvidas acadêmicas associadas a matérias, responder diretamente,
curtir publicações, seguir estudantes, pesquisar, denunciar conteúdo e
administrar contas, matérias, moderação e FAQ.

## Funcionalidades por tela ou área

### Acesso: cadastro e login

- Cadastrar uma conta com e-mail e senha; a conta começa como USER e ACTIVE.
- Entrar com e-mail ou username e senha.
- Emitir JWT de acesso com duração de 60 minutos; não há refresh token.
- Direcionar a pessoa autenticada sem nome ou username para completar o perfil
  antes de acessar o feed.
- Não há login ou cadastro com Google na versão 1.0.

### Recuperação e redefinição de senha

- Solicitar recuperação informando e-mail, sem revelar se a conta existe.
- Enviar por e-mail link com token imprevisível de uso único.
- Persistir somente SHA-256 do token; validade de 15 minutos.
- Validar expiração e uso, redefinir senha com BCrypt e invalidar o token usado.
- Um novo pedido pode invalidar tokens anteriores ainda válidos.
- Somente no perfil local de desenvolvimento é permitido registrar o link no
  console; token nunca é retornado em DTO público nem registrado em produção.

### Conclusão do perfil e onboarding

- Definir nome e username após o cadastro; ambos são necessários antes do feed.
- Normalizar username para minúsculas, sem `@`, e verificar unicidade sem
  diferenciar maiúsculas de minúsculas.
- Permitir avatar, biografia, matrícula, curso, semestre e matérias no perfil.
- Matrícula e curso são opcionais; matrícula só é mantida se a pessoa a
  informar e é única entre as contas que a informarem. O semestre não é exigido para criar ou usar a conta; se a pessoa
  quiser incluir o semestre no perfil, deve informar esse campo. Vínculo com a
  Unifor é declaratório.
- Permitir atualizar os campos editáveis do próprio perfil sem permitir alterar
  papel, estado ou datas de auditoria.
- Oferecer onboarding opcional, que pode ser pulado e reaberto pelo menu; pular
  ou concluir onboarding não substitui a conclusão obrigatória do perfil.

### Feed

- Exibir posts ativos em ordem cronológica decrescente, em páginas de 10.
- Permitir carregamento incremental e filtro opcional por matéria.
- Exibir título, conteúdo integral, matéria, data, autoria resumida, total de
  curtidas, total de respostas e estado de curtida da pessoa autenticada.
- Não mostrar posts logicamente excluídos em consultas públicas.
- Contagens são calculadas por consultas, não armazenadas como contadores.

### Detalhe do post e respostas

- Consultar post ativo e suas respostas diretas.
- Criar post de dúvida com título, conteúdo e matéria obrigatórios.
- Criar resposta textual diretamente no post e listar respostas por post ou
  autor.
- Autor pode excluir logicamente o próprio post ou resposta; MODERATOR e ADMIN
  podem moderar/excluir conteúdo de qualquer autor.
- Posts e respostas não podem ser editados. Não existem threads, respostas a
  respostas, resposta aceita ou selo automático de proficiência.
- Respostas não recebem curtidas. Posts e respostas usam tipo TEXT, com limite
  de validação de 300 caracteres para ambos.
- Não é permitido responder a post excluído.

### Curtidas

- Curtir e descurtir posts; uma curtida por pessoa/post, protegida também por
  restrição única no banco e tratamento de concorrência.
- Consultar total e estado da curtida; listar posts curtidos quando disponível
  na área do próprio perfil.
- Descurtir pode remover fisicamente o registro PostLike.
- Não há curtidas em respostas.

### Busca

- Buscar posts parcialmente e sem diferenciar maiúsculas/minúsculas por título,
  conteúdo ou matéria, com paginação e filtro opcional por matéria.
- Buscar estudantes por nome, biografia e matérias que dominam ou desejam
  aprender.
- Busca semântica, recomendações e ranking avançado não fazem parte da versão.

### Perfil próprio

- Consultar dados privados da própria conta por contrato separado do perfil
  público, sem retornar senha ou hash.
- Exibir e atualizar dados editáveis do perfil e associações com matérias.
- Associar uma matéria com interesse DOMINA ou QUER_APRENDER e proficiência
  INICIANTE, INTERMEDIARIO ou AVANCADO; atualizar ou remover a associação.
- Consultar publicações, respostas, curtidas e contagens previstas.
- Não existe funcionalidade de itens salvos na versão 1.0.

### Perfil público de estudante

- Exibir avatar, nome, username, biografia, matérias/interesses, proficiência
  autodeclarada, posts ativos, atividade de respostas e contagens calculadas de
  posts, respostas, seguidores e seguidos.
- Não expor e-mail, matrícula, hash de senha, papel/estado privados ou estado
  interno de onboarding.
- Seguir ou deixar de seguir o estudante; consultar listas de seguidores e
  seguidos e estado do relacionamento.
- Impedir auto-seguimento, duplicação e interação com contas excluídas.
- Compartilhar URL do perfil é apenas navegação/cópia de URL; não há persistência
  de compartilhamento.

### Matérias

- Consultar por ID, listar matérias e pesquisar por nome.
- Associar matérias ao próprio perfil.
- ADMIN pode criar e renomear matéria.
- Não permitir excluir matéria enquanto existir qualquer associação com
  usuários ou posts; não apagar posts/históricos em cascata.
- Impedir nomes duplicados sem diferença de maiúsculas/minúsculas.

### Denúncias e moderação

- Denunciar post ou resposta de outra pessoa com motivo SPAM, FORA_DO_TEMA,
  CONTEUDO_INADEQUADO ou OUTRO e detalhes opcionais.
- Não denunciar o próprio conteúdo nem denunciar o mesmo alvo mais de uma vez.
- Cada denúncia referencia exatamente um post ou uma resposta.
- Denunciar não oculta nem exclui conteúdo automaticamente; preservar histórico.
- USER consulta somente o que suas permissões permitirem; MODERATOR e ADMIN
  consultam pendências, abrem denúncia e registram decisão RESOLVED ou DISMISSED,
  responsável e data da análise.
- Moderadores e administradores podem excluir conteúdo conforme a política de
  moderação.

### FAQ e informações da plataforma

- Usuários consultam FAQ ativo e informações públicas da plataforma.
- A área de menu permite encerrar a sessão no cliente e voltar à tela de acesso;
  como o JWT é stateless e não há refresh token, o cliente descarta o token.
- ADMIN cria FAQ, atualiza pergunta/resposta, ordenação, ativa/desativa e exclui
  conforme política administrativa; FAQ não precisa manter FK do editor.
- Tickets e contato interno com administradores estão fora da versão 1.0. Termos
  ou políticas só podem ser exibidos se houver conteúdo institucional definido;
  não há gestão desses documentos no escopo funcional atual.

### Administração de contas

- ADMIN lista usuários com paginação, consulta dados administrativos e altera
  papéis/estados por operações protegidas.
- Papéis: USER, MODERATOR e ADMIN. Estados: ACTIVE, SUSPENDED e DELETED.
- Somente ADMIN administra contas; usuário não altera o próprio papel ou estado.
- Conta suspensa não autentica nem publica, mas conteúdo existente permanece.
- Exclusão é lógica e anonimiza a conta, revoga acesso e preserva posts/respostas.
- Nunca expor senha, hash, token ou dados internos de autenticação.

## Regras transversais

- Backend é a autoridade para validação e autorização. A identidade do autor vem
  do contexto de segurança, nunca de um ID de usuário confiado ao cliente.
- API sob `/api`; Controller -> Service -> Repository -> Entity -> MySQL.
- DTOs específicos de entrada/saída; Entities não são serializadas diretamente.
- Regras, autorização de domínio e transações ficam no Service. Erros usam
  tratamento centralizado e formato ApiErrorDTO.
- E-mail e username são únicos sem distinção de caixa. Matrícula, se informada,
  também é única; nome de matéria é único sem distinção de caixa.
- Preservar integridade e histórico; não usar remoção em cascata indiscriminada.
- JWT stateless, BCrypt, segredos em variáveis de ambiente e CORS por ambiente.

## Fora do escopo da versão 1.0

Edição de posts ou respostas; threads e respostas a respostas; curtidas em
respostas; resposta aceita e selo de proficiência; Google OAuth; imagens em
posts; tags livres; itens salvos; persistência de compartilhamentos; dados de
emprego, empregador ou redes sociais no perfil; pontuação, sequência de login,
verificação acadêmica e reputação; chat, notificações, bloqueios, grupos,
chamadas, compartilhamento de tela, tickets e contato interno de suporte;
recomendações personalizadas, busca semântica, ranking avançado; layout
responsivo e suporte oficial a dispositivos móveis.

## Decisões confirmadas

- Matrícula e curso podem permanecer no perfil como campos opcionais; matrícula
  só é mantida quando informada e deve ser única. Semestre é opcional, mas torna-se obrigatório
  quando a pessoa optar por exibi-lo no perfil. Não há verificação acadêmica.
- Conteúdo de post e resposta tem limite de 300 caracteres, apesar de ser
  armazenado em coluna TEXT.
- Matéria associada a qualquer usuário ou post não pode ser excluída.

Qualquer alteração de escopo deve atualizar primeiro este documento, o guia,
as histórias afetadas e o diagrama, para manter uma única versão compartilhada.
