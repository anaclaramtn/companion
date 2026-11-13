import api from '../api/api.js'

// Denúncias para quem modera (MODERATOR ou ADMIN). Cada item vem como
// { id, reporter, reviewedBy, targetType: 'POST' | 'POST_COMMENT', targetId,
//   postId, targetPreview, reason, details, status, createdAt, reviewedAt }.
export async function getReports({ status, page = 0, size = 10 } = {}) {
  const response = await api.get('/reports', { params: { status, page, size } })
  return response.data
}

// status: 'RESOLVED' (houve providência) ou 'DISMISSED' (sem violação).
export async function reviewReport(reportId, status) {
  const response = await api.patch(`/reports/${reportId}`, { status })
  return response.data
}
