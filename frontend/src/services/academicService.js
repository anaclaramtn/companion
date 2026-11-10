import api from '../api/api.js'

// Catálogo acadêmico vindo do banco: universidades, cursos e disciplinas.

export async function getUniversities() {
  const response = await api.get('/universities')
  return response.data
}

// Cursos da universidade, cada um com totalSemesters.
export async function getCourses(universityId) {
  const response = await api.get(`/universities/${universityId}/courses`)
  return response.data
}

// Grade do curso no formato do SubjectInterestPicker: { id, code, name,
// semester }. Na API, semestre 0 indica optativa; aqui vira null.
export async function getCourseSubjects(courseId) {
  const response = await api.get(`/courses/${courseId}/subjects`)
  return response.data.map(({ id, code, name, semester }) => ({
    id,
    code,
    name,
    semester: semester === 0 ? null : semester,
  }))
}

// Matérias com mais dúvidas publicadas nos últimos 7 dias: lista de
// { id, code, name, postCount }, da mais citada para a menos citada.
export async function getTrendingSubjects({ limit = 6 } = {}) {
  const response = await api.get('/subjects/trending', { params: { limit } })
  return response.data
}

// Todas as disciplinas cadastradas, para quem ainda não escolheu o curso.
// Sem grade, não há semestre (semester undefined).
export async function getAllSubjects() {
  const response = await api.get('/subjects')
  return response.data.map(({ id, code, name }) => ({ id, code, name }))
}
