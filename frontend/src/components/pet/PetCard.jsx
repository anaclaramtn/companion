import { Link } from 'react-router'
import { getPetProgress, PET_STAGES } from '../../data/petStages.js'
import PixelPet from './PixelPet.jsx'

// O bichinho da lateral: evolui conforme a quantidade de respostas da conta.
function PetCard({ name, answerCount }) {
  const { index, stage, nextStage, remaining, ratio } = getPetProgress(answerCount)
  const answersLabel = answerCount === 1 ? '1 resposta' : `${answerCount} respostas`

  return (
    <section
      aria-labelledby="pet-card-title"
      className="flex min-h-90 flex-col rounded-2xl border border-companion-border/70 bg-companion-surface p-4 text-center shadow-sm"
    >
      <h2
        id="pet-card-title"
        className="text-left text-xs font-bold uppercase tracking-wide text-companion-muted"
      >
        Seu companheiro
      </h2>
      <div className="flex flex-1 items-center justify-center py-3">
        <PixelPet
          sprite={stage.sprite}
          label={`${name || 'Seu companheiro'}, um dinossauro laranja na fase ${index + 1}`}
          className="size-36"
        />
      </div>
      {name ? (
        <h3 className="break-words text-base font-bold text-companion-text">{name}</h3>
      ) : (
        <Link to="/configuracoes" className="text-sm font-bold text-companion-brand hover:underline">
          Dar um nome
        </Link>
      )}
      <p className="text-xs text-companion-muted">
        Fase {index + 1} de {PET_STAGES.length} · {answersLabel}
      </p>
      <div
        role="progressbar"
        aria-label="Progresso até a próxima fase"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        className="mt-3 h-2 overflow-hidden rounded-full bg-companion-panel"
      >
        <div
          className="h-full rounded-full bg-companion-orange transition-[width] duration-500"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-companion-muted">
        {nextStage
          ? `${remaining === 1 ? 'Falta 1 resposta' : `Faltam ${remaining} respostas`} para evoluir`
          : 'Evolução máxima!'}
      </p>
    </section>
  )
}

export default PetCard
