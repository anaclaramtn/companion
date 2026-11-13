import { Link } from 'react-router'
import SubjectTag from '../common/SubjectTag.jsx'

// Seção "Dúvida relacionada" da janela de detalhe. Clicar troca a dúvida da
// própria janela (replace), sem empilhar outra entrada no histórico.
function RelatedPost({ related, isLoading }) {
  return (
    <section aria-labelledby="related-post-title" className="space-y-3">
      <h2 id="related-post-title" className="text-base font-bold text-companion-text">
        Dúvida relacionada
      </h2>

      {isLoading ? (
        <p role="status" className="text-sm text-companion-muted">
          Procurando uma dúvida sobre o mesmo assunto...
        </p>
      ) : related ? (
        <Link
          to={`?duvida=${related.id}`}
          replace
          state={{ postModal: true }}
          className="block rounded-2xl border border-companion-border/70 bg-companion-panel/60 p-4 transition-colors hover:border-companion-orange/70 hover:bg-companion-panel/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-companion-orange"
        >
          <p className="text-xs text-companion-muted">
            {related.author.name}
            {related.author.username && ` · @${related.author.username}`}
          </p>
          <h3 className="mt-1 font-bold text-companion-text">{related.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-companion-muted">{related.content}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(related.subjects ?? []).map((subject) => (
              <SubjectTag key={subject.id} name={subject.name} />
            ))}
            <span className="ml-auto flex items-center gap-3 text-xs text-companion-muted">
              <span>
                <i className="bi bi-heart" aria-hidden="true" /> {related.likeCount}
              </span>
              <span>
                <i className="bi bi-chat" aria-hidden="true" /> {related.commentCount}
              </span>
            </span>
          </div>
        </Link>
      ) : (
        <p className="text-sm text-companion-muted">
          Ainda não há outra dúvida sobre este assunto.
        </p>
      )}
    </section>
  )
}

export default RelatedPost
