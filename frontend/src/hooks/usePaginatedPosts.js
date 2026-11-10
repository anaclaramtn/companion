import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiErrorMessage } from '../services/apiError.js'

const initialState = {
  posts: [],
  page: -1,
  last: false,
  totalElements: 0,
  isLoading: true,
  error: '',
}

// Carrega posts página a página. fetchPage(page) deve devolver a resposta
// paginada da API ({ content, page, last, totalElements }) e precisa ser
// estável (useCallback): quando ela muda (ex.: outro filtro), a lista é
// trocada pela página 0 da nova busca assim que ela chegar. Para limpar a
// lista na hora, dê uma key nova ao componente que usa o hook.
export function usePaginatedPosts(fetchPage, errorFallback = 'Não foi possível carregar as dúvidas.') {
  const [state, setState] = useState(initialState)
  // Identifica a requisição mais recente, para descartar respostas atrasadas.
  const requestRef = useRef(0)

  const storePage = useCallback((requestId, page, data) => {
    if (requestId !== requestRef.current) return
    setState((current) => {
      // Um post novo desloca as páginas; evita mostrar o mesmo post duas vezes.
      const known = new Set(current.posts.map((post) => post.id))
      const posts = page === 0
        ? data.content
        : [...current.posts, ...data.content.filter((post) => !known.has(post.id))]
      return {
        posts,
        page: data.page,
        last: data.last,
        totalElements: data.totalElements,
        isLoading: false,
        error: '',
      }
    })
  }, [])

  const storeError = useCallback((requestId, error) => {
    if (requestId !== requestRef.current) return
    setState((current) => ({
      ...current,
      isLoading: false,
      error: getApiErrorMessage(error, errorFallback),
    }))
  }, [errorFallback])

  const fetchAndStore = useCallback(
    (page) => {
      const requestId = ++requestRef.current
      fetchPage(page).then(
        (data) => storePage(requestId, page, data),
        (error) => storeError(requestId, error),
      )
    },
    [fetchPage, storePage, storeError],
  )

  // Primeira página. O estado inicial já está como "carregando".
  useEffect(() => {
    const requestId = ++requestRef.current
    fetchPage(0).then(
      (data) => storePage(requestId, 0, data),
      (error) => storeError(requestId, error),
    )
  }, [fetchPage, storePage, storeError])

  const { isLoading, last, error, page } = state

  // Busca a página seguinte à última carregada (ou a primeira, após erro nela).
  const loadNextPage = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: '' }))
    fetchAndStore(page + 1)
  }, [page, fetchAndStore])

  const loadMore = useCallback(() => {
    if (!isLoading && !last && !error) loadNextPage()
  }, [isLoading, last, error, loadNextPage])

  // Tira um post da lista sem recarregar (ex.: tirado dos Salvos). A página
  // seguinte vem do servidor já sem ele, então um post pode ficar de fora
  // até recarregar a tela.
  const removePost = useCallback((postId) => {
    setState((current) => ({
      ...current,
      posts: current.posts.filter((post) => post.id !== postId),
      totalElements: Math.max(0, current.totalElements - 1),
    }))
  }, [])

  return {
    posts: state.posts,
    removePost,
    totalElements: state.totalElements,
    isLoading,
    error,
    hasMore: !last,
    loadMore,
    retry: loadNextPage,
  }
}
