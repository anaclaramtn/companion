function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

export const mockRepliesByPost = {
  101: [
    {
      id: 1001,
      postId: 101,
      author: {
        id: 56,
        name: 'Carla Souza',
        username: 'carlasouza',
        avatarUrl: null,
      },
      content:
        'Uma lista encadeada armazena cada elemento junto com uma referência para o próximo nó. Isso facilita inserções, mas o acesso por índice é sequencial.',
      createdAt: minutesAgo(45),
      likeCount: 3,
      likedByCurrentUser: false,
      reportedByCurrentUser: false,
    },
    {
      id: 1002,
      postId: 101,
      author: {
        id: 61,
        name: 'Rafael Lima',
        username: 'rafaellima',
        avatarUrl: null,
      },
      content:
        'Se quiser visualizar melhor, desenhe os nós como caixas e as referências como setas. Cada nó aponta para o seguinte.',
      createdAt: minutesAgo(20),
      likeCount: 1,
      likedByCurrentUser: false,
      reportedByCurrentUser: false,
    },
  ],
  102: [
    {
      id: 1003,
      postId: 102,
      author: {
        id: 72,
        name: 'João Pedro',
        username: 'joaopedro',
        avatarUrl: null,
      },
      content:
        'Use uma chave estrangeira quando precisar garantir que o registro relacionado exista na outra tabela.',
      createdAt: minutesAgo(90),
      likeCount: 2,
      likedByCurrentUser: false,
      reportedByCurrentUser: false,
    },
  ],
}
