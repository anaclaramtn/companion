import { mockRepliesByPost } from './mockPostReplies.js'
import { getSubjectById } from './mockSubjects.js'

function hoursAgo(hours) {
  const date = new Date(Date.now() - hours * 60 * 60 * 1000)
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  )

  return localDate.toISOString().slice(0, 19)
}

export const mockPostReportReasons = [
  { id: 1, label: 'Spam' },
  { id: 2, label: 'Fora do tema' },
  { id: 3, label: 'Conteúdo inadequado' },
  { id: 4, label: 'Outro' },
]

// Autores resumidos, iguais aos perfis de mockPublicUsers.js.
const authors = {
  pedro: { id: 17, name: 'Pedro Alves', username: 'pedro.alves', avatarUrl: null },
  ana: { id: 23, name: 'Ana Beatriz', username: 'anabeatriz', avatarUrl: null },
  lucas: { id: 31, name: 'Lucas Mendes', username: 'lucas.mendes', avatarUrl: null },
  marina: { id: 42, name: 'Marina Costa', username: 'marina.costa', avatarUrl: null },
  carla: { id: 56, name: 'Carla Souza', username: 'carlasouza', avatarUrl: null },
  rafael: { id: 61, name: 'Rafael Lima', username: 'rafaellima', avatarUrl: null },
  joao: { id: 72, name: 'João Pedro', username: 'joaopedro', avatarUrl: null },
  // Conta autenticada (mockCurrentUser).
  voce: { id: 0, name: 'Você', username: 'voce', avatarUrl: null },
}

function mockPost({
  id,
  author,
  subjectIds,
  title,
  content,
  hours,
  likeCount = 0,
  likedByCurrentUser = false,
}) {
  const ownedByCurrentUser = author.id === authors.voce.id
  // Contagem calculada a partir das respostas, como a API fará com COUNT.
  const commentCount = mockRepliesByPost[id]?.length ?? 0

  return {
    id,
    author,
    subjects: subjectIds.map((subjectId) => {
      const { id: subjectCode, name } = getSubjectById(subjectId)
      return { id: subjectCode, name }
    }),
    title,
    content,
    createdAt: hoursAgo(hours),
    likeCount,
    commentCount,
    likedByCurrentUser,
    savedByCurrentUser: false,
    ownedByCurrentUser,
  }
}

// subjectIds usam os códigos de mockSubjects.js (ex.: T390 = Estrutura de dados).
const posts = [
  mockPost({
    id: 101,
    author: authors.pedro,
    subjectIds: ['T390'],
    title: 'Alguém pode me ajudar com esta questão?',
    content:
      'Estou estudando estruturas de dados e fiquei com uma dúvida sobre listas encadeadas.',
    hours: 2,
    likeCount: 14,
  }),
  mockPost({
    id: 102,
    author: authors.ana,
    subjectIds: ['T333'],
    title: 'Quando devo usar uma chave estrangeira?',
    content:
      'Queria entender como escolher os relacionamentos entre as tabelas de um projeto.',
    hours: 4,
    likeCount: 9,
  }),
  mockPost({
    id: 105,
    author: authors.carla,
    subjectIds: ['T198'],
    title: 'Como calcular a complexidade de um algoritmo recursivo?',
    content:
      'Entendo o Big O de laços simples, mas me perco quando a função chama ela mesma. Alguém tem um passo a passo para montar a recorrência?',
    hours: 6,
    likeCount: 18,
  }),
  mockPost({
    id: 106,
    author: authors.rafael,
    subjectIds: ['T100'],
    title: 'Qual a intuição por trás da regra da cadeia?',
    content:
      'Sei aplicar a fórmula da derivada de uma função composta, mas não entendo por que ela funciona. Existe uma forma visual de pensar nisso?',
    hours: 9,
    likeCount: 11,
  }),
  mockPost({
    id: 107,
    author: authors.joao,
    subjectIds: ['T320'],
    title: 'Por que não devo guardar senhas em texto puro?',
    content:
      'No projeto da disciplina o professor pediu para usar hash nas senhas. Qual a diferença entre hash e criptografia, e por que usar BCrypt?',
    hours: 12,
    likeCount: 23,
    likedByCurrentUser: true,
  }),
  mockPost({
    id: 116,
    author: authors.rafael,
    subjectIds: ['T164'],
    title: 'Quando usar herança e quando usar composição?',
    content:
      'No trabalho de POO fiquei em dúvida se uma classe Aluno deveria herdar de Pessoa ou apenas ter uma Pessoa dentro dela. Existe alguma regra prática?',
    hours: 14,
    likeCount: 15,
  }),
  mockPost({
    id: 115,
    author: authors.voce,
    subjectIds: ['T100'],
    title: 'Alguém tem dicas para estudar derivadas?',
    content:
      'Entendo a definição por limite, mas na hora dos exercícios demoro muito. Vale mais decorar as regras ou praticar muitas questões?',
    hours: 15,
    likeCount: 4,
  }),
  mockPost({
    id: 108,
    author: authors.marina,
    subjectIds: ['T242'],
    title: 'Como funciona o CORS quando o front chama a API?',
    content:
      'Meu front em React chama a API local e o navegador bloqueia a requisição com erro de CORS. Isso é configurado no front ou no back?',
    hours: 20,
    likeCount: 16,
  }),
  mockPost({
    id: 117,
    author: authors.joao,
    subjectIds: ['T296'],
    title: 'Qual a diferença entre busca em largura e A*?',
    content:
      'Em Inteligência Artificial vimos vários algoritmos de busca. Entendi a busca em largura, mas não ficou claro o que a heurística muda no A*.',
    hours: 24,
    likeCount: 9,
  }),
  mockPost({
    id: 103,
    author: authors.lucas,
    subjectIds: ['T310'],
    title: 'Por onde começar a estudar redes de computadores?',
    content:
      'Estou procurando uma recomendação de conteúdo para quem está começando.',
    hours: 26,
    likeCount: 21,
    likedByCurrentUser: true,
  }),
  mockPost({
    id: 109,
    author: authors.pedro,
    subjectIds: ['T160', 'T390'],
    title: 'Busca binária só funciona em vetor ordenado?',
    content:
      'Entendi que ela divide o vetor ao meio a cada passo, mas o que acontece se os dados não estiverem ordenados? Vale ordenar antes de buscar?',
    hours: 30,
    likeCount: 8,
  }),
  mockPost({
    id: 110,
    author: authors.ana,
    subjectIds: ['T333', 'T242'],
    title: 'Vale a pena usar ORM em projeto de faculdade?',
    content:
      'Estou em dúvida entre escrever SQL na mão ou usar um ORM para o trabalho final. Quais as vantagens de cada um para quem está aprendendo?',
    hours: 36,
    likeCount: 12,
  }),
  mockPost({
    id: 111,
    author: authors.lucas,
    subjectIds: ['T310', 'T320'],
    title: 'Qual a diferença entre HTTP e HTTPS na prática?',
    content:
      'Sei que o HTTPS é mais seguro, mas o que muda na comunicação entre o navegador e o servidor? Onde entra o certificado?',
    hours: 40,
    likeCount: 19,
  }),
  mockPost({
    id: 118,
    author: authors.carla,
    subjectIds: ['T290'],
    title: 'Dijkstra funciona com pesos negativos?',
    content:
      'Na lista de grafos tem uma questão com arestas de peso negativo e o Dijkstra deu resposta errada. Qual algoritmo devo usar nesse caso?',
    hours: 44,
    likeCount: 14,
  }),
  mockPost({
    id: 104,
    author: authors.marina,
    subjectIds: ['T242'],
    title: 'Qual é a diferença entre estado e props no React?',
    content:
      'Os dois parecem passar informações para os componentes. Em que momento uso cada um?',
    hours: 48,
    likeCount: 7,
  }),
  mockPost({
    id: 112,
    author: authors.rafael,
    subjectIds: ['T100'],
    title: 'Quando um limite não existe?',
    content:
      'Na lista de exercícios aparecem funções em que os limites laterais são diferentes. Nesse caso o limite não existe mesmo ou depende do ponto?',
    hours: 60,
    likeCount: 6,
  }),
  mockPost({
    id: 113,
    author: authors.carla,
    subjectIds: ['T390'],
    title: 'Pilha ou fila para implementar o "desfazer" de um editor?',
    content:
      'Estou fazendo um editor de texto simples e preciso guardar as ações para desfazer. Qual estrutura faz mais sentido e por quê?',
    hours: 72,
    likeCount: 10,
  }),
  mockPost({
    id: 114,
    author: authors.marina,
    subjectIds: ['T242'],
    title: 'Por que o useEffect roda duas vezes no desenvolvimento?',
    content:
      'Coloquei um console.log dentro do useEffect e ele aparece duas vezes quando rodo o projeto com npm run dev. Isso é um erro no meu código?',
    hours: 80,
    likeCount: 13,
  }),
]

export const mockPostsResponse = {
  content: posts,
  page: 0,
  size: 20,
  totalElements: posts.length,
  totalPages: 1,
  first: true,
  last: true,
}
