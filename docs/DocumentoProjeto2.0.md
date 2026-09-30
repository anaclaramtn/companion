# Especificação de Requisitos de Software Companion
Esse documento é a versão 2 do primeiro documento do projeto, que foi o rascunho inicial da aplicação. No documento atual, a equipe tomou mais decisões importantes de arquitetura, que afetaram a estrutura do monolíto.


## Histórico de versões

| **Data**   | **Versão** | **Descrição**                                       | **Autor**                 |
|------------|------------|-----------------------------------------------------|---------------------------|
| 10/09/2026 | 1.0        | Versão Inicial – Criação do documento de requisitos | João Victor Maciel Chaves |
| 30/09/2026 | 2.0        | Versão Atual – Polimento do escopo completo, ajustes nas decisões de arquitetura e desenho do funcionamento da aplicação | Ana Clara A. Martins      |
|            |            |                                                     |                           |


# Introdução

Este documento busca especificar os requisitos da aplicação Web “Companion”, que será implementado pelos alunos Ana Clara Alves Martins, Bruno Facó Ponte, João Victor Maciel Chaves, Ygor Costa Maciel e Vinner Rodrigues de Oliveira, fornecendo informações suficientes para o projeto e implementação, da mesma forma que para o desenvolvimento e para os testes. O público-alvo do documento são o investidor principal (nesse caso, o professor) e a equipe desenvolvedora. O sistema “Companion” busca promover uma maior facilidade na aprendizagem dos conteúdos para os alunos do curso de Ciência da Computação da Universidade de Fortaleza, possuindo, como efeitos colaterais, a criação de conexões e maior adesão de alunos calouros ao curso.

## Finalidade

A finalidade deste documento é apontar e organizar os requisitos funcionais, “não funcionais” e regras de negócio envolvidos no desenvolvimento do projeto. Os requisitos funcionais são o detalhamento das características com função específica do sistema. Os requisitos “não funcionais” são os requisitos de sistemas que não são detalhados imediatamente na especificação de caso de uso. As regras de negócio são particularidades e cálculos que tornam o sistema particular.

## Escopo do Produto

O objetivo do projeto é desenvolver uma aplicação web com o fito de apoiar os estudantes de Ciência da Computação da Universidade de Fortaleza no que converge aos estudos e relações sociais.

Ele permitirá que os alunos encontrem outros alunos que os possam ajudar (ou que necessitem de ajuda), com o intuito de facilitar o contato e a troca de conhecimentos entre o corpo discente. A forma de encontrar esses alunos se dará por meio da própria aplicação, que, com formato de rede social, promoverá um ambiente que facilita o estudo colaborativo.

Quando pensamos sobre a sensação de exclusão social e o não pertencimento, é importante notar que eles possuem uma intrínseca relação com a percepção do aluno de ser bom o suficiente para o curso - afinal, a percepção do não pertencimento é influenciado sobretudo por dois fatores, a aceitação social ("as pessoas daqui me aceitam?") e a aceitação acadêmica ("eu sou bom o suficiente pra estar aqui?").

Esses dois fatores são extremamente importantes no desenvolvimento acadêmico do aluno, e tem influência direta na probabilidade de evasão do aluno dos cursos de computação. De acordo com o INEP (pela pesquisa de Indicadores de Fluxo da Educação Superior), os cursos de computação possuem a segunda maior taxa de abandono do ensino superior no Brasil, logo atrás de matemática.

Os cursos da área da computação são cursos que possuem uma dificuldade documentada de construção de pertencimento e comunidade, levando a situações de exclusão acadêmica e social, portanto, dificultando que esses alunos possam ter colegas com quem tirar dúvidas simples ou desenvolver diálogos acerca dos conteúdos lecionados.

De acordo com a pesquisa feita por Höhne & Zander em 2019, com 449 alunos de computação, em uma escala de 1 a 5 de percepção de exclusão social, esses alunos apresentaram uma média de 2,88, além do fato de que as mulheres possuíam uma maior incerteza de pertencimento ao ambiente que os homens (18% maior), indicando claros problemas de integração e pertencimento social.

Além disso, de acordo com o artigo de Dekhane, Park, Jonassen & Jin (2024), “Virtual Peer Mentoring to Develop a Sense of Belonging During COVID-19 – A Pilot Study”, que foi feito em uma instituição pública de acesso aberto nos Estados Unidos, a prática das mentorias (nesse caso, realizadas de forma online) tem capacidade de ampliar o sentimento de pertencimento dos alunos. Os mentores, que eram estudantes de nível mais avançado, entraram em contato com alunos calouros/no início da universidade semanalmente, por 14 semanas, conversando não apenas sobre os conteúdos da universidade, mas também sobre assuntos mais particulares, como crescimento pessoal, orientação e suporte acadêmico, resolução de problemas pessoais, autoeficácia, etc... O resultado dessas 14 semanas foi um aumento da sensação de pertencimento desses alunos ao curso, além de aumentar a retenção desses alunos na instituição.

O Companion organiza a colaboração acadêmica em posts de dúvida. Cada post pertence a uma matéria e pode receber respostas de outros estudantes. A resposta com mais curtidas é apresentada como aceita, enquanto a resposta do usuário com maior proficiência na matéria recebe um destaque próprio. O sistema combina perfis, seguidores, busca e troca de conhecimento em um ambiente voltado aos estudantes de Ciência da Computação da Universidade de Fortaleza.

## Referências

Site Web “Twitter”/”X” -\> Interface de usuário

Site Web “Brainly” -\> Mecanismo de Perguntas e Respostas

(Höhne E, Zander L. Sources of Male and Female Students' Belonging Uncertainty in the Computer Sciences. Front Psychol. 2019 Aug 13;10:1740. doi: 10.3389/fpsyg.2019.01740. Erratum in: Front Psychol. 2023 Feb 01;13:1096269. doi: 10.3389/fpsyg.2022.1096269. PMID: 31456707; PMCID: PMC6700275.)

Sonal Dekhane, Hyesung Park, Lorraine Jonassen, and Wei Jin. 2024. Virtual Peer Mentoring to Develop a Sense of Belonging During COVID-19 - A Pilot Study. In Proceedings of the 55th ACM Technical Symposium on Computer Science Education V. 1 (SIGCSE 2024). Association for Computing Machinery, New York, NY, USA, 283–288. https://doi.org/10.1145/3626252.3630962

# Descrição Geral

## 2.1 Perspectiva do Produto

O “Companion” será uma aplicação Web nova e autossuficiente, desenvolvida para apoiar os estudantes de Ciência da Computação da Universidade de Fortaleza nos estudos e na interação com outros alunos. O sistema funcionará como uma rede social acadêmica, permitindo que estudantes encontrem colegas com interesses ou conhecimentos em comum, facilitando a formação de grupos de estudo e a troca de conhecimentos. O produto atuará de forma complementar às plataformas acadêmicas já utilizadas pela universidade, tendo como principal foco a colaboração e a conexão entre os estudantes.

## 2.2 Funções do Produto

Veja uma breve descrição de alguns dos serviços oferecidos pelo Companion:

- Criação de post de dúvida: O usuário poderá criar um post associado a uma matéria para solicitar ajuda sobre um conteúdo do curso.

- Resposta ao post: Outros usuários poderão responder ao post por meio de comentários, compartilhando explicações e possíveis soluções.

- Editar e excluir conteúdo: O autor poderá editar ou excluir logicamente o próprio post ou resposta. Conteúdo alterado exibirá a indicação “Editado”, e o administrador poderá removê-lo por moderação.

- Curtidas e destaques: Usuários poderão curtir respostas. A resposta com mais curtidas será aceita automaticamente, e o respondente com maior proficiência na matéria receberá um destaque adicional.

- Seguir outros usuários: A partir das dúvidas publicadas, o usuário poderá seguir outros alunos que considere interessantes ou que possam contribuir para seus estudos.

- Ver dúvidas de um usuário: No perfil de cada usuário, será possível visualizar outras dúvidas que ele já publicou na plataforma.

- Informações do perfil: O perfil apresentará foto, biografia, matérias dominadas ou desejadas, proficiência autodeclarada, seguidores, pessoas seguidas, posts publicados e atividade de respostas.

## 2.3 Classes de Usuários e Características

O sistema contará principalmente com a classe **Usuário**, responsável pelo uso geral da plataforma, como criação de dúvidas, respostas, comentários e interação com outros estudantes e a classe **Administrador**, composta pelos responsáveis pelo desenvolvimento e gerenciamento do sistema, terá acesso a funções administrativas e de manutenção da plataforma.

## 2.4 Ambiente de Trabalho

## 2.5 Design e Implementação Restrições

-Conclusão do projeto até o final de novembro de 2026;

-Não haverá apoio financeiro;

-Execução local do backend, frontend e banco de dados para apresentação e portfólio, com instruções de instalação no GitHub;

-Utilização das IDEs Virtual Studio Code, IntelliJ Community, MySQL Workbench;

-Utilização de HTML5, CSS3, JavaScript, Java 21, React, Vite, Tailwind CSS, Spring Boot, Gradle, Spring Data JPA, Spring Security e MySQL;

-Utilização do GitHub como repositório de códigos;

-Utilização da aplicação Trello para o gerenciamento do projeto;

-O acesso ao sistema será feito via Web;

## 2.6 Documentação do Usuário

No primeiro acesso, o Companion oferecerá um passo a passo opcional sobre navegação, criação de posts, seleção de matéria, respostas, curtidas, busca e perfis. O usuário poderá pular o onboarding e abri-lo novamente pelo menu.

A área de perguntas frequentes auxiliará os usuários com as dúvidas mais comuns. Tickets e contato interno com administradores ficam em espera para uma versão posterior.

## 2.7 Suposições e Dependências

A configuração mínima para executar o Companion é um computador com Windows 10 ou 11, Google Chrome e acesso à Internet. O cadastro será público e não exigirá aprovação; por se tratar de um projeto acadêmico, a vinculação do usuário à Unifor será declaratória, sem integração externa para validação.

# Requisitos do Sistema

## Requisitos Funcionais

| **ID**   | **ÁREA**      | **REQUISITO**            | **DESCRIÇÃO**                                                                               |
|----------|---------------|--------------------------|---------------------------------------------------------------------------------------------|
| **RF01** | LOGIN         | REALIZAR LOGIN           | Permitir que usuário e administrador entrem com credenciais cadastradas.                    |
| **RF02** | CADASTRO      | CRIAR CONTA              | Permitir cadastro público, sem aprovação administrativa.                                    |
| **RF03** | CONTA         | RECUPERAR SENHA          | Gerar token de uso único, válido por 15 minutos, e enviar link de redefinição por e-mail.   |
| **RF04** | PERFIL        | EDITAR PERFIL            | Alterar foto, biografia, matérias e proficiência autodeclarada.                             |
| **RF05** | PERFIL        | VISUALIZAR PERFIL        | Exibir informações públicas, posts e atividade de respostas de outros estudantes.           |
| **RF06** | POSTS         | CRIAR POST               | Publicar uma dúvida obrigatoriamente associada a uma matéria.                               |
| **RF07** | POSTS         | VISUALIZAR FEED E POST   | Exibir posts recentes em páginas de 10 itens e permitir abrir seus detalhes.                |
| **RF08** | CONTEÚDO      | EDITAR CONTEÚDO          | Permitir que o autor edite seu post ou resposta e sinalizar o conteúdo como Editado.        |
| **RF09** | CONTEÚDO      | EXCLUIR CONTEÚDO         | Realizar exclusão lógica pelo autor ou exclusão administrativa por moderação.               |
| **RF10** | RESPOSTAS     | RESPONDER POST           | Permitir respostas aos posts por meio de PostComment.                                       |
| **RF11** | RESPOSTAS     | CURTIR RESPOSTA          | Permitir uma curtida por usuário em cada resposta, sem autocurtida.                         |
| **RF12** | RESPOSTAS     | DESTACAR RESPOSTA ACEITA | Destacar automaticamente a resposta com mais curtidas, aplicando os critérios de desempate. |
| **RF13** | RESPOSTAS     | DESTACAR PROFICIÊNCIA    | Sinalizar a resposta do usuário com maior proficiência na matéria do post.                  |
| **RF14** | USUÁRIOS      | SEGUIR USUÁRIO           | Permitir que um estudante siga outro.                                                       |
| **RF15** | USUÁRIOS      | DEIXAR DE SEGUIR         | Permitir que um estudante deixe de seguir outro.                                            |
| **RF16** | BUSCA         | PESQUISAR USUÁRIOS       | Pesquisar estudantes por nome, biografia e matérias.                                        |
| **RF17** | BUSCA         | PESQUISAR POSTS          | Pesquisar posts por título, descrição e matéria.                                            |
| **RF18** | SUPORTE       | CONSULTAR FAQ            | Disponibilizar perguntas frequentes.                                                        |
| **RF19** | ONBOARDING    | CONSULTAR TUTORIAL       | Oferecer tutorial opcional, ignorável e acessível novamente pelo menu.                      |
| **RF20** | ADMINISTRAÇÃO | GERENCIAR USUÁRIOS       | Visualizar, suspender, reativar ou excluir contas.                                          |
| **RF21** | ADMINISTRAÇÃO | GERENCIAR CONTEÚDO E FAQ | Moderar posts e respostas e manter as perguntas frequentes.                                 |

## Requisitos Não Funcionais

| **ID**    | **ÁREA**           | **REQUISITO**         | **DESCRIÇÃO**                                                                                 |
|-----------|--------------------|-----------------------|-----------------------------------------------------------------------------------------------|
| **RNF01** | USABILIDADE        | INTERFACE INTUITIVA   | O sistema deverá possuir uma interface simples, consistente e fácil de compreender.           |
| **RNF02** | COMPATIBILIDADE    | AMBIENTE SUPORTADO    | Suporte oficial ao Google Chrome no Windows 10 e 11.                                          |
| **RNF03** | DESEMPENHO         | TEMPO DE RESPOSTA     | Operações comuns em até 2 segundos e pesquisas em até 3 segundos no ambiente local.           |
| **RNF04** | SEGURANÇA          | PROTEÇÃO DE DADOS     | Usar Spring Security, JWT, BCrypt, autorização por papel e segredos em variáveis de ambiente. |
| **RNF05** | DISPONIBILIDADE    | EXECUÇÃO LOCAL        | O sistema ficará disponível enquanto frontend, backend e banco locais estiverem em execução.  |
| **RNF06** | MANUTENIBILIDADE   | ORGANIZAÇÃO DO CÓDIGO | Manter arquitetura em camadas, DTOs e responsabilidades separadas.                            |
| **RNF07** | BANCO DE DADOS     | PERSISTÊNCIA          | Persistir usuários, matérias, posts, respostas, curtidas, seguidores e FAQ no MySQL.          |
| **RNF08** | TECNOLOGIA         | TECNOLOGIAS DEFINIDAS | Utilizar React, Vite, JavaScript, Tailwind CSS, Java 21, Spring Boot, Gradle e MySQL.         |
| **RNF09** | CONTROLE DE VERSÃO | GITHUB                | Manter código e instruções de execução local no GitHub.                                       |

## Regras de Negócio

| **ID**   | **ÁREA**   | **REQUISITO**            | **DESCRIÇÃO**                                                                                |
|----------|------------|--------------------------|----------------------------------------------------------------------------------------------|
| **RN01** | CONTA      | CONTA INDIVIDUAL         | Cada usuário possui uma conta própria.                                                       |
| **RN02** | CONTEÚDO   | AUTORIA E MODERAÇÃO      | O autor altera ou exclui o próprio conteúdo; o administrador pode moderar qualquer conteúdo. |
| **RN03** | CONTEÚDO   | EXCLUSÃO LÓGICA          | Posts e respostas são excluídos logicamente para preservar o histórico.                      |
| **RN04** | MATÉRIAS   | PROFICIÊNCIA             | A proficiência é autodeclarada como iniciante, intermediária ou avançada.                    |
| **RN05** | POSTS      | POST É DÚVIDA            | Todo Post representa uma dúvida acadêmica e deve possuir uma matéria.                        |
| **RN06** | RESPOSTAS  | COMENTÁRIO É RESPOSTA    | PostComment representa a resposta ao post.                                                   |
| **RN07** | RESPOSTAS  | RESPOSTA ACEITA          | A resposta com mais curtidas é aceita automaticamente.                                       |
| **RN08** | RESPOSTAS  | DESEMPATE                | Em empate, vence maior proficiência; persistindo, vence a resposta mais antiga.              |
| **RN09** | RESPOSTAS  | DESTAQUE DE PROFICIÊNCIA | A resposta do usuário mais proficiente recebe selo próprio.                                  |
| **RN10** | CURTIDAS   | CURTIDA ÚNICA            | Cada usuário pode curtir uma resposta uma vez e não pode curtir a própria resposta.          |
| **RN11** | EDIÇÃO     | CONTEÚDO EDITADO         | Conteúdo alterado após a publicação deve exibir a indicação Editado.                         |
| **RN12** | CADASTRO   | ACESSO PÚBLICO           | O cadastro é público e a vinculação à Unifor é declaratória.                                 |
| **RN13** | CONTA      | SUSPENSÃO E EXCLUSÃO     | Conta suspensa perde acesso; conta excluída é anonimizada e tem o conteúdo preservado.       |
| **RN14** | CONTEÚDO   | FINALIDADE ACADÊMICA     | As publicações devem tratar de conteúdos de Ciência da Computação.                           |
| **RN15** | CONTADORES | VALORES CALCULADOS       | Contadores de atividade e relacionamento são calculados por consulta.                        |

# Casos de Uso

## Atores

| **ID**   | **ATOR**      | **DESCRIÇÃO**                                                                                                                                                                |
|----------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **AT01** | USUÁRIO       | Aluno de Ciência da Computação da UNIFOR que utiliza a plataforma para criar e visualizar dúvidas, responder perguntas, comentar, criar posts e interagir com outros alunos. |
| **AT02** | ADMINISTRADOR | Responsável pelo gerenciamento e manutenção da plataforma, possuindo acesso às funções administrativas do sistema.                                                           |

## Casos de Uso

| **ID**   | **ATOR**      | **CASO DE USO**                                       |
|----------|---------------|-------------------------------------------------------|
| **UC01** | USUÁRIO       | Realizar login                                        |
| **UC02** | USUÁRIO       | Criar conta                                           |
| **UC03** | USUÁRIO       | Recuperar senha                                       |
| **UC04** | USUÁRIO       | Editar perfil e proficiência                          |
| **UC05** | USUÁRIO       | Visualizar perfil e atividade                         |
| **UC06** | USUÁRIO       | Criar post de dúvida                                  |
| **UC07** | USUÁRIO       | Visualizar feed e post                                |
| **UC08** | USUÁRIO       | Editar ou excluir logicamente o próprio conteúdo      |
| **UC09** | USUÁRIO       | Responder post                                        |
| **UC10** | USUÁRIO       | Curtir ou remover curtida de uma resposta             |
| **UC11** | USUÁRIO       | Visualizar resposta aceita e destaque de proficiência |
| **UC12** | USUÁRIO       | Seguir usuário                                        |
| **UC13** | USUÁRIO       | Deixar de seguir usuário                              |
| **UC14** | USUÁRIO       | Pesquisar estudantes                                  |
| **UC15** | USUÁRIO       | Pesquisar posts                                       |
| **UC16** | USUÁRIO       | Consultar perguntas frequentes                        |
| **UC17** | USUÁRIO       | Consultar ou pular onboarding                         |
| **UC18** | ADMINISTRADOR | Gerenciar usuários                                    |
| **UC19** | ADMINISTRADOR | Moderar posts e respostas                             |
| **UC20** | ADMINISTRADOR | Gerenciar perguntas frequentes                        |


# Melhorias futuras

- Tickets de suporte e contato interno com administradores

- Layout responsivo e suporte oficial a dispositivos móveis

- Moderador como classe de usuário com permissões limitadas

- Chat em tempo real e mensagens diretas com WebSocket

- Central de notificações

- Algoritmo avançado de recomendação do feed

- Visualização do feed sem conta

- Recomendação automática de estudantes

Criação de grupos de estudo

Chamadas de voz e compartilhamento de tela
