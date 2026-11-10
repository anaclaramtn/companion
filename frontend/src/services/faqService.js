import api from '../api/api.js'

// Dúvidas frequentes ativas, na ordem definida pela administração:
// lista de { id, question, answer, displayOrder, ... }.
export async function getFaqs() {
  const response = await api.get('/faqs')
  return response.data
}
