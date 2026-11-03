function hoursAgo(hours) {
  const date = new Date(Date.now() - hours * 60 * 60 * 1000)
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  )

  return localDate.toISOString().slice(0, 19)
}

export const mockSubjects = [
  { id: 1, name: 'Estruturas de Dados' },
  { id: 2, name: 'Banco de Dados' },
  { id: 3, name: 'Redes' },
  { id: 4, name: 'Desenvolvimento Web' },
  { id: 5, name: 'Algoritmos' },
  { id: 6, name: 'Segurança' },
]

export const mockPostReportReasons = [
  { id: 1, label: 'Spam' },
  { id: 2, label: 'Fora do tema' },
  { id: 3, label: 'Conteúdo inadequado' },
  { id: 4, label: 'Outro' },
]

export const mockPostsResponse = {
  content: [
    {
      id: 101,
      author: {
        id: 17,
        name: 'Pedro Alves',
        username: 'pedro.alves',
        avatarUrl: null,
      },
      subject: { id: 1, name: 'Estruturas de Dados' },
      title: 'Alguém pode me ajudar com esta questão?',
      content:
        'Estou estudando estruturas de dados e fiquei com uma dúvida sobre listas encadeadas.',
      createdAt: hoursAgo(2),
      likeCount: 14,
      commentCount: 1,
      likedByCurrentUser: false,
      savedByCurrentUser: false,
      ownedByCurrentUser: false,
    },
    {
      id: 102,
      author: {
        id: 23,
        name: 'Ana Beatriz',
        username: 'anabeatriz',
        avatarUrl: null,
      },
      subject: { id: 2, name: 'Banco de Dados' },
      title: 'Quando devo usar uma chave estrangeira?',
      content:
        'Queria entender como escolher os relacionamentos entre as tabelas de um projeto.',
      createdAt: hoursAgo(4),
      likeCount: 9,
      commentCount: 0,
      likedByCurrentUser: false,
      savedByCurrentUser: false,
      ownedByCurrentUser: false,
    },
    {
      id: 103,
      author: {
        id: 31,
        name: 'Lucas Mendes',
        username: 'lucas.mendes',
        avatarUrl: null,
      },
      subject: { id: 3, name: 'Redes' },
      title: 'Por onde começar a estudar redes de computadores?',
      content:
        'Estou procurando uma recomendação de conteúdo para quem está começando.',
      createdAt: hoursAgo(26),
      likeCount: 21,
      commentCount: 1,
      likedByCurrentUser: true,
      savedByCurrentUser: false,
      ownedByCurrentUser: false,
    },
    {
      id: 104,
      author: {
        id: 42,
        name: 'Marina Costa',
        username: 'marina.costa',
        avatarUrl: null,
      },
      subject: { id: 4, name: 'Desenvolvimento Web' },
      title: 'Qual é a diferença entre estado e props no React?',
      content:
        'Os dois parecem passar informações para os componentes. Em que momento uso cada um?',
      createdAt: hoursAgo(48),
      likeCount: 7,
      commentCount: 3,
      likedByCurrentUser: false,
      savedByCurrentUser: false,
      ownedByCurrentUser: false,
    },
  ],
  page: 0,
  size: 4,
  totalElements: 4,
  totalPages: 1,
  first: true,
  last: true,
}
