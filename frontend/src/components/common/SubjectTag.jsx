// Etiqueta de conteúdo/matéria. Com onRemove, mostra um botão para removê-la.
function SubjectTag({ name, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-companion-orange/10 px-3 py-1 text-xs font-semibold text-companion-brand">
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${name}`}
          className="-mr-1 grid size-4 place-items-center rounded-lg transition hover:bg-companion-orange/20"
        >
          <i className="bi bi-x" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}

export default SubjectTag
