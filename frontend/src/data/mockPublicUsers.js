import { getSubjectById } from './mockSubjects.js'

// ID 0 representa a conta autenticada enquanto a autenticação não está integrada.
export const mockCurrentUser = {
  id: 0,
  name: 'Você',
  username: 'voce',
  avatarUrl: null,
  bio: 'Estudante de Ciência da Computação e parte da comunidade Companion.',
  course: 'Ciência da Computação',
  semester: 4,
  postCount: 1,
  commentCount: 1,
  followerCount: 2,
  followingCount: 1,
  createdAt: '2026-01-10T12:00:00',
}

export const mockPublicUsers = [
  {
    id: 17,
    name: 'Pedro Alves',
    username: 'pedro.alves',
    avatarUrl: null,
    bio: 'Aprendendo estruturas de dados e compartilhando dúvidas pelo caminho.',
    course: 'Ciência da Computação',
    semester: 3,
    postCount: 2,
    commentCount: 0,
    followerCount: 4,
    followingCount: 7,
    createdAt: '2025-08-12T09:30:00',
  },
  {
    id: 23,
    name: 'Ana Beatriz',
    username: 'anabeatriz',
    avatarUrl: null,
    bio: 'Gosto de modelagem de dados e de aprender em grupo.',
    course: 'Ciência da Computação',
    semester: 5,
    postCount: 2,
    commentCount: 0,
    followerCount: 3,
    followingCount: 2,
    createdAt: '2025-06-02T14:15:00',
  },
  {
    id: 31,
    name: 'Lucas Mendes',
    username: 'lucas.mendes',
    avatarUrl: null,
    bio: 'Curioso sobre redes, sistemas e como a internet funciona.',
    course: 'Ciência da Computação',
    semester: 2,
    postCount: 2,
    commentCount: 0,
    followerCount: 1,
    followingCount: 1,
    createdAt: '2025-09-18T10:00:00',
  },
  {
    id: 42,
    name: 'Marina Costa',
    username: 'marina.costa',
    avatarUrl: null,
    bio: 'Explorando desenvolvimento web e construindo projetos com React.',
    course: 'Ciência da Computação',
    semester: 6,
    postCount: 3,
    commentCount: 0,
    followerCount: 2,
    followingCount: 2,
    createdAt: '2025-04-05T08:20:00',
  },
  {
    id: 56,
    name: 'Carla Souza',
    username: 'carlasouza',
    avatarUrl: null,
    bio: 'Compartilhando o que aprendo em algoritmos e estruturas de dados.',
    course: 'Ciência da Computação',
    semester: 7,
    postCount: 3,
    commentCount: 1,
    followerCount: 1,
    followingCount: 1,
    createdAt: '2025-03-21T11:10:00',
  },
  {
    id: 61,
    name: 'Rafael Lima',
    username: 'rafaellima',
    avatarUrl: null,
    bio: 'Aprendendo a explicar programação de um jeito simples.',
    course: 'Ciência da Computação',
    semester: 5,
    postCount: 3,
    commentCount: 1,
    followerCount: 1,
    followingCount: 1,
    createdAt: '2025-07-11T16:40:00',
  },
  {
    id: 72,
    name: 'João Pedro',
    username: 'joaopedro',
    avatarUrl: null,
    bio: 'Interesse em banco de dados e engenharia de software.',
    course: 'Ciência da Computação',
    semester: 4,
    postCount: 2,
    commentCount: 1,
    followerCount: 1,
    followingCount: 1,
    createdAt: '2025-10-03T13:05:00',
  },
]

// Monta a associação usuário-matéria a partir do código da disciplina.
function userSubject(id, subjectCode, interestType, proficiency) {
  const { name } = getSubjectById(subjectCode)
  return { id, subject: { id: subjectCode, name }, interestType, proficiency }
}

export const mockUserSubjects = {
  0: [
    userSubject(1, 'T100', 'QUER_APRENDER', 'INICIANTE'),
    userSubject(2, 'T310', 'QUER_APRENDER', 'INICIANTE'),
    userSubject(3, 'T242', 'DOMINA', 'INTERMEDIARIO'),
    userSubject(4, 'T198', 'DOMINA', 'AVANCADO'),
  ],
  17: [
    userSubject(1701, 'T390', 'QUER_APRENDER', 'INICIANTE'),
    userSubject(1702, 'T160', 'DOMINA', 'INTERMEDIARIO'),
  ],
  23: [
    userSubject(2301, 'T333', 'DOMINA', 'INTERMEDIARIO'),
    userSubject(2302, 'T242', 'QUER_APRENDER', 'INICIANTE'),
  ],
  31: [
    userSubject(3101, 'T310', 'QUER_APRENDER', 'INICIANTE'),
  ],
  42: [
    userSubject(4201, 'T242', 'DOMINA', 'AVANCADO'),
  ],
  56: [
    userSubject(5601, 'T390', 'DOMINA', 'AVANCADO'),
    userSubject(5602, 'T290', 'QUER_APRENDER', 'INTERMEDIARIO'),
  ],
  61: [
    userSubject(6101, 'T164', 'DOMINA', 'INTERMEDIARIO'),
    userSubject(6102, 'T100', 'QUER_APRENDER', 'INTERMEDIARIO'),
  ],
  72: [
    userSubject(7201, 'T320', 'DOMINA', 'INTERMEDIARIO'),
    userSubject(7202, 'T296', 'QUER_APRENDER', 'INICIANTE'),
  ],
}

export const mockUserFollowStatuses = {
  17: { userId: 17, followedByCurrentUser: false, followerCount: 4, followingCount: 7 },
  23: { userId: 23, followedByCurrentUser: true, followerCount: 3, followingCount: 2 },
  31: { userId: 31, followedByCurrentUser: false, followerCount: 1, followingCount: 1 },
  42: { userId: 42, followedByCurrentUser: false, followerCount: 2, followingCount: 2 },
  56: { userId: 56, followedByCurrentUser: false, followerCount: 1, followingCount: 1 },
  61: { userId: 61, followedByCurrentUser: false, followerCount: 1, followingCount: 1 },
  72: { userId: 72, followedByCurrentUser: false, followerCount: 1, followingCount: 1 },
}

export const mockUserFollowLists = {
  0: { followers: [17, 42], following: [23] },
  17: { followers: [23, 56, 61, 72], following: [0, 23, 31, 42, 56, 61, 72] },
  23: { followers: [0, 17, 31], following: [17, 42] },
  31: { followers: [17], following: [23] },
  42: { followers: [17, 23], following: [0, 17] },
  56: { followers: [17], following: [61] },
  61: { followers: [17], following: [72] },
  72: { followers: [17], following: [23] },
}
