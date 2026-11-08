import { useState } from 'react'
import { useToast } from '../../hooks/useToast.js'

const MAX_SUBJECTS_PER_GROUP = 5

const groups = [
  {
    interestType: 'QUER_APRENDER',
    title: 'Tenho dificuldade',
    shortTitle: 'Dificuldade',
    description: 'Disciplinas em que você quer ajuda.',
  },
  {
    interestType: 'DOMINA',
    title: 'Posso ajudar',
    shortTitle: 'Posso ajudar',
    description: 'Disciplinas em que você pode ajudar colegas.',
  },
]

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('pt-BR')
}

// Agrupa as disciplinas por semestre da grade; optativas ficam no fim.
function groupBySemester(subjects) {
  const sections = new Map()
  for (const subject of subjects) {
    const key = subject.semester ?? 'optativas'
    if (!sections.has(key)) sections.set(key, [])
    sections.get(key).push(subject)
  }
  return [...sections.entries()].map(([key, items]) => ({
    key,
    title: key === 'optativas' ? 'Optativas' : `${key}º semestre`,
    items,
  }))
}

function chipClassName(isSelected) {
  return `whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition ${
    isSelected
      ? 'border-companion-orange bg-companion-orange text-white'
      : 'border-companion-orange/40 bg-white/50 text-companion-brand hover:border-companion-orange'
  }`
}

// Seleção das disciplinas do perfil em dois grupos. Mostra só as escolhidas e
// algumas sugeridas (featuredIds); "Ver todas" abre a lista completa com busca.
// Uma disciplina fica em no máximo um grupo: escolhê-la em um remove do outro.
// Cada grupo aceita até 5 disciplinas; passar disso mostra um toast.
// value: lista de { subject, interestType }.
function SubjectInterestPicker({ subjects, value, onChange, featuredIds = [] }) {
  const showToast = useToast()
  const [isExpanded, setIsExpanded] = useState(false)
  const [search, setSearch] = useState('')

  function getInterest(subjectId) {
    return value.find((item) => item.subject.id === subjectId)?.interestType
  }

  function countInGroup(interestType) {
    return value.filter((item) => item.interestType === interestType).length
  }

  function toggle(subject, interestType) {
    const others = value.filter((item) => item.subject.id !== subject.id)

    if (getInterest(subject.id) === interestType) {
      onChange(others)
      return
    }

    if (countInGroup(interestType) >= MAX_SUBJECTS_PER_GROUP) {
      const group = groups.find((item) => item.interestType === interestType)
      showToast(
        `Você pode escolher no máximo ${MAX_SUBJECTS_PER_GROUP} disciplinas em “${group.title}”. Remova uma para adicionar outra.`,
        { type: 'error' },
      )
      return
    }

    onChange([
      ...others,
      { subject: { id: subject.id, name: subject.name }, interestType },
    ])
  }

  function getVisibleSubjects(interestType) {
    return subjects.filter(
      (subject) =>
        getInterest(subject.id) === interestType ||
        (featuredIds.includes(subject.id) && !getInterest(subject.id)),
    )
  }

  const normalizedSearch = normalize(search.trim())
  const filteredSubjects = subjects.filter(
    (subject) =>
      !normalizedSearch ||
      normalize(subject.name).includes(normalizedSearch) ||
      normalize(subject.id).includes(normalizedSearch),
  )

  return (
    <div className="@container space-y-4">
      <div className="grid gap-3 @lg:grid-cols-2">
        {groups.map((group) => (
          <fieldset
            key={group.interestType}
            className="min-w-0 rounded-lg bg-[#faecd8] p-4 sm:p-5"
          >
            <legend className="sr-only">{group.title}</legend>
            <p className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wide text-companion-brand">
              <span aria-hidden="true">{group.title}</span>
              <span className="font-semibold normal-case tracking-normal text-companion-muted">
                {countInGroup(group.interestType)}/{MAX_SUBJECTS_PER_GROUP}
                <span className="sr-only"> disciplinas escolhidas</span>
              </span>
            </p>
            <p className="mt-1 text-xs text-companion-muted">
              {group.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {getVisibleSubjects(group.interestType).map((subject) => {
                const isSelected = getInterest(subject.id) === group.interestType
                return (
                  <button
                    key={subject.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggle(subject, group.interestType)}
                    className={chipClassName(isSelected)}
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

      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        aria-controls="subject-picker-full-list"
        className="inline-flex items-center gap-2 text-sm font-semibold text-companion-brand hover:underline"
      >
        <i
          className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}
          aria-hidden="true"
        />
        {isExpanded
          ? 'Ver menos'
          : `Ver mais: todas as disciplinas (${subjects.length})`}
      </button>

      {isExpanded && (
        <div
          id="subject-picker-full-list"
          className="overflow-hidden rounded-xl border border-companion-border/70"
        >
          <div className="border-b border-companion-border/60 bg-white/60 p-3">
            <label htmlFor="subject-picker-search" className="sr-only">
              Buscar disciplina por nome ou código
            </label>
            <div className="relative">
              <i
                aria-hidden="true"
                className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-companion-muted"
              />
              <input
                id="subject-picker-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome ou código (ex.: T390)"
                className="h-10 w-full rounded-lg border border-companion-border bg-white pl-9 pr-3 text-sm text-companion-text outline-none transition focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredSubjects.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-companion-muted">
                Nenhuma disciplina encontrada para “{search}”.
              </p>
            ) : (
              groupBySemester(filteredSubjects).map((section) => (
                <section key={section.key} aria-label={section.title}>
                  <h3 className="sticky top-0 bg-companion-surface px-4 py-2 text-[0.65rem] font-bold uppercase tracking-wide text-companion-muted">
                    {section.title}
                  </h3>
                  <ul>
                    {section.items.map((subject) => (
                      <li
                        key={subject.id}
                        className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-companion-border/40 px-4 py-2"
                      >
                        <span className="min-w-0 grow basis-full text-sm text-companion-text @md:basis-0">
                          <span className="text-companion-muted">{subject.id}</span>
                          {' · '}
                          {subject.name}
                        </span>
                        {groups.map((group) => {
                          const isSelected =
                            getInterest(subject.id) === group.interestType
                          return (
                            <button
                              key={group.interestType}
                              type="button"
                              aria-pressed={isSelected}
                              aria-label={`${group.title}: ${subject.name}`}
                              onClick={() => toggle(subject, group.interestType)}
                              className={chipClassName(isSelected)}
                            >
                              {group.shortTitle}
                            </button>
                          )
                        })}
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SubjectInterestPicker
