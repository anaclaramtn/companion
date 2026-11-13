import { useEffect, useState } from 'react'
import { getPosts } from '../services/postService.js'

// Procura uma dúvida sobre o mesmo assunto: a mais recente, diferente da atual,
// que tenha alguma das matérias dela (tenta uma matéria por vez, na ordem).
// Por enquanto mostramos só uma; o feed da API já filtra por matéria.
export function useRelatedPost(post) {
  const [result, setResult] = useState({ postId: null, related: null })
  const postId = post?.id
  const subjectIds = (post?.subjects ?? []).map((subject) => subject.id).join(',')

  useEffect(() => {
    if (!postId) return undefined
    let active = true

    async function findRelated() {
      for (const subjectId of subjectIds.split(',').filter(Boolean)) {
        try {
          const page = await getPosts({ subjectId })
          const related = page.content.find((item) => item.id !== postId)
          if (related) {
            if (active) setResult({ postId, related })
            return
          }
        } catch {
          // Sem a sugestão, a janela só não mostra a seção; tenta a próxima matéria.
        }
      }
      if (active) setResult({ postId, related: null })
    }

    findRelated()
    return () => {
      active = false
    }
  }, [postId, subjectIds])

  const isCurrent = result.postId === postId
  return {
    related: isCurrent ? result.related : null,
    isLoading: Boolean(postId) && !isCurrent,
  }
}
