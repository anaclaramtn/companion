import { mockAccount } from '../data/mockAccount.js'
import { mockPublicUsers } from '../data/mockPublicUsers.js'

// Simula as operações da própria conta enquanto a API não está integrada.
// As alterações ficam só em memória: recarregar a página volta aos mocks.

function mockResponse(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 400)
  })
}

export function getMyAccount() {
  return mockResponse({ ...mockAccount })
}

// Envia ao e-mail da conta um link para criar uma nova senha.
// Retorna o e-mail usado, para a tela informar ao usuário.
export function sendPasswordResetEmail() {
  return mockResponse({ email: mockAccount.email })
}

export function deleteMyAccount() {
  return mockResponse(null)
}

export function normalizeUsername(username) {
  return username.trim().replace(/^@+/, '').toLowerCase()
}

// Troca o username da conta, verificando se já está em uso.
export async function updateUsername(currentUser, newUsername) {
  const username = normalizeUsername(newUsername)
  const isTaken = mockPublicUsers.some(
    (user) => user.id !== currentUser.id && user.username === username,
  )

  if (isTaken) {
    await mockResponse(null)
    throw new Error('Este username já está em uso. Escolha outro.')
  }

  return mockResponse({ ...currentUser, username })
}

export async function updateMyProfile(currentUser, currentSubjects, changes) {
  const user = {
    ...currentUser,
    name: changes.name.trim(),
    avatarUrl: changes.avatarUrl,
    bio: changes.bio.trim(),
    course: changes.course.trim(),
    semester: changes.semester ? Number(changes.semester) : null,
  }

  // Mantém a proficiência das matérias que já estavam associadas.
  const subjects = changes.subjects.map(({ subject, interestType }) => {
    const existing = currentSubjects.find(
      (item) => item.subject.id === subject.id,
    )
    return {
      id: existing?.id ?? subject.id,
      subject,
      interestType,
      proficiency: existing?.proficiency ?? 'INICIANTE',
    }
  })

  return mockResponse({ user, subjects })
}
