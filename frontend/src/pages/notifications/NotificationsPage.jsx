import { useCallback, useState } from 'react'
import { Link, Navigate, useOutletContext } from 'react-router'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import LoadMoreTrigger from '../../components/common/LoadMoreTrigger.jsx'
import { usePaginatedPosts } from '../../hooks/usePaginatedPosts.js'
import { usePostActions } from '../../hooks/usePostActions.js'
import { useToast } from '../../hooks/useToast.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import { REPORT_REASONS } from '../../services/postService.js'
import { getReports, reviewReport } from '../../services/reportService.js'

const tabs = [
  { status: 'PENDING', label: 'Pendentes', emptyText: 'Nenhuma denúncia aguardando análise.' },
  { status: 'RESOLVED', label: 'Resolvidas', emptyText: 'Nenhuma denúncia resolvida ainda.' },
  { status: 'DISMISSED', label: 'Descartadas', emptyText: 'Nenhuma denúncia descartada ainda.' },
]

function reasonLabel(reason) {
  return REPORT_REASONS.find((item) => item.id === reason)?.label ?? reason
}

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

// Denúncias de dúvidas e respostas, para administração e moderação. Quem não
// modera volta ao feed.
function NotificationsPage() {
  const { canModerate } = usePostActions()
  if (!canModerate) return <Navigate to="/feed" replace />
  return <ReportInbox />
}

function ReportInbox() {
  const [status, setStatus] = useState('PENDING')
  const activeTab = tabs.find((tab) => tab.status === status)

  return (
    <section aria-labelledby="notifications-title">
      <h1
        id="notifications-title"
        className="mb-5 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
      >
        Notificações
      </h1>

      <div
        role="tablist"
        aria-label="Situação das denúncias"
        className="mb-4 flex overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
      >
        {tabs.map((tab) => {
          const isActive = tab.status === status
          return (
            <button
              key={tab.status}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setStatus(tab.status)}
              className={`flex-1 border-b-2 px-4 py-3.5 text-sm font-bold transition ${
                isActive
                  ? 'border-companion-orange text-companion-brand'
                  : 'border-transparent text-companion-muted hover:text-companion-text'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* A key recria a lista ao trocar de aba, para não misturar situações. */}
      <ReportList key={status} status={status} emptyText={activeTab.emptyText} />
    </section>
  )
}

function ReportList({ status, emptyText }) {
  const { onReportsChanged } = useOutletContext()
  const fetchPage = useCallback((page) => getReports({ status, page }), [status])
  const {
    posts: reports,
    removePost: removeReport,
    isLoading,
    error,
    hasMore,
    loadMore,
    retry,
  } = usePaginatedPosts(fetchPage, 'Não foi possível carregar as denúncias.')
  const isFirstLoad = isLoading && reports.length === 0

  function handleReviewed(reportId) {
    removeReport(reportId)
    onReportsChanged?.()
  }

  if (isFirstLoad) {
    return (
      <p role="status" className="py-16 text-center text-lg font-semibold text-companion-muted">
        Carregando denúncias...
      </p>
    )
  }

  return (
    <>
      {reports.length === 0 && !error ? (
        <p role="status" className="py-16 text-center text-lg font-semibold text-companion-muted">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id}>
              <ReportCard report={report} onReviewed={handleReviewed} />
            </li>
          ))}
        </ul>
      )}

      {error ? (
        <div role="alert" className="mt-4 flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
          >
            Tentar de novo
          </button>
        </div>
      ) : (
        hasMore &&
        reports.length > 0 && (
          <LoadMoreTrigger onLoadMore={loadMore} isLoading={isLoading} label="Carregar mais denúncias" />
        )
      )}
    </>
  )
}

function ReportCard({ report, onReviewed }) {
  const { deletePost, deleteReply } = usePostActions()
  const showToast = useToast()
  const [isBusy, setIsBusy] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isPending = report.status === 'PENDING'
  const isPost = report.targetType === 'POST'

  async function review(nextStatus, message) {
    setIsBusy(true)
    try {
      await reviewReport(report.id, nextStatus)
      showToast(message)
      onReviewed(report.id)
    } catch (error) {
      setIsBusy(false)
      // 409: outra pessoa já analisou; a lista só precisa atualizar.
      if (error.response?.status === 409) {
        showToast('Esta denúncia já foi analisada.')
        onReviewed(report.id)
        return
      }
      showToast(getApiErrorMessage(error, 'Não foi possível atualizar a denúncia.'), {
        type: 'error',
      })
    }
  }

  // Exclui a dúvida ou resposta denunciada e dá a denúncia como resolvida.
  async function deleteContentAndResolve() {
    setIsBusy(true)
    try {
      await (isPost ? deletePost(report.targetId) : deleteReply(report.targetId))
    } catch {
      // O aviso de erro já foi mostrado; a confirmação continua aberta.
      setIsBusy(false)
      return
    }
    setIsDeleteOpen(false)
    await review('RESOLVED', 'Denúncia resolvida.')
  }

  return (
    <>
      <article className="rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-companion-text">
            <i className="bi bi-flag-fill text-companion-brand" aria-hidden="true" />
            {isPost ? 'Dúvida denunciada' : 'Resposta denunciada'}
          </span>
          <span className="rounded-md bg-companion-orange/10 px-2 py-0.5 text-xs font-semibold text-companion-brand">
            {reasonLabel(report.reason)}
          </span>
          <time dateTime={report.createdAt} className="ml-auto text-xs text-companion-muted">
            {formatDate(report.createdAt)}
          </time>
        </div>

        <p className="mt-3 rounded-xl border border-companion-border/70 bg-companion-panel/60 px-4 py-3 text-sm text-companion-text">
          {report.targetPreview}
        </p>

        {report.details && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-companion-muted">
            <span className="font-semibold text-companion-text">Detalhes: </span>
            {report.details}
          </p>
        )}

        <p className="mt-3 text-xs text-companion-muted">
          Denunciado por {report.reporter.name ?? 'usuário'}
          {report.reporter.username && ` (@${report.reporter.username})`}
          {!isPending && report.reviewedBy && (
            <>
              {' · '}
              {report.status === 'RESOLVED' ? 'Resolvida' : 'Descartada'} por{' '}
              {report.reviewedBy.name ?? 'moderação'}
              {report.reviewedAt && ` em ${formatDate(report.reviewedAt)}`}
            </>
          )}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-companion-border/70 pt-4 text-sm">
          <Link
            to={`?duvida=${report.postId}`}
            state={{ postModal: true }}
            className="mr-auto inline-flex items-center gap-2 font-semibold text-companion-brand hover:underline"
          >
            <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            Ver dúvida
          </Link>

          {isPending && (
            <>
              <button
                type="button"
                onClick={() => review('DISMISSED', 'Denúncia descartada.')}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-xl border border-companion-border bg-companion-panel px-4 py-2 font-bold text-companion-text transition hover:bg-companion-orange/5 disabled:opacity-60"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
                Descartar
              </button>
              <button
                type="button"
                onClick={() => review('RESOLVED', 'Denúncia resolvida.')}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-companion-orange px-4 py-2 font-bold text-white transition hover:bg-companion-orange-hover disabled:opacity-60"
              >
                <i className="bi bi-check-lg" aria-hidden="true" />
                Resolver
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isBusy}
                aria-label={isPost ? 'Excluir dúvida denunciada' : 'Excluir resposta denunciada'}
                title={isPost ? 'Excluir dúvida denunciada' : 'Excluir resposta denunciada'}
                className="text-lg text-companion-muted transition-colors hover:text-red-600 disabled:opacity-60"
              >
                <i className="bi bi-trash" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </article>

      {isDeleteOpen && (
        <ConfirmDialog
          title={isPost ? 'Excluir esta dúvida?' : 'Excluir esta resposta?'}
          description="O conteúdo deixa de aparecer para todo mundo e a denúncia é marcada como resolvida. Essa ação não pode ser desfeita."
          confirmLabel="Excluir e resolver"
          tone="danger"
          isConfirming={isBusy}
          onConfirm={deleteContentAndResolve}
          onCancel={() => !isBusy && setIsDeleteOpen(false)}
        />
      )}
    </>
  )
}

export default NotificationsPage
