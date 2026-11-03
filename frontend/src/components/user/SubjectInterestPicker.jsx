const groups = [
  {
    interestType: 'QUER_APRENDER',
    title: 'Tenho dificuldade',
    description: 'Matérias em que você quer ajuda.',
  },
  {
    interestType: 'DOMINA',
    title: 'Posso ajudar',
    description: 'Matérias em que você pode ajudar colegas.',
  },
]

// Seleção de matérias do perfil em dois grupos. Uma matéria fica em no máximo
// um grupo: escolhê-la em um remove do outro.
// value: lista de { subject, interestType }.
function SubjectInterestPicker({ subjects, value, onChange }) {
  function getInterest(subjectId) {
    return value.find((item) => item.subject.id === subjectId)?.interestType
  }

  function toggle(subject, interestType) {
    const others = value.filter((item) => item.subject.id !== subject.id)
    onChange(
      getInterest(subject.id) === interestType
        ? others
        : [...others, { subject, interestType }],
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <fieldset
          key={group.interestType}
          className="rounded-lg bg-[#faecd8] p-4 sm:p-5"
        >
          <legend className="sr-only">{group.title}</legend>
          <p
            aria-hidden="true"
            className="text-xs font-bold uppercase tracking-wide text-companion-brand"
          >
            {group.title}
          </p>
          <p className="mt-1 text-xs text-companion-muted">
            {group.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const isSelected =
                getInterest(subject.id) === group.interestType

              return (
                <button
                  key={subject.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(subject, group.interestType)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? 'border-companion-orange bg-companion-orange text-white'
                      : 'border-companion-orange/40 bg-white/50 text-companion-brand hover:border-companion-orange'
                  }`}
                >
                  {isSelected && (
                    <i className="bi bi-check-lg mr-1" aria-hidden="true" />
                  )}
                  {subject.name}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

export default SubjectInterestPicker
