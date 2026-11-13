function SubjectGroup({ title, subjects }) {
  return (
    <section className="rounded-lg bg-companion-tint p-4 sm:p-5">
      <h3 className="text-xs font-bold uppercase tracking-wide text-companion-brand">
        {title}
      </h3>
      {subjects.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {subjects.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-companion-orange bg-companion-panel/50 px-3 py-1 text-xs font-medium text-companion-brand"
            >
              {item.subject.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-companion-muted">
          Nenhuma matéria nesta categoria.
        </p>
      )}
    </section>
  )
}

// Matérias do perfil separadas entre "quer aprender" e "domina".
function ProfileSubjects({ subjects }) {
  if (subjects.length === 0) return null

  return (
    <section aria-labelledby="profile-subjects-title" className="mt-4">
      <h2 id="profile-subjects-title" className="sr-only">
        Matérias
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <SubjectGroup
          title="Tenho dificuldade"
          subjects={subjects.filter((item) => item.interestType === 'QUER_APRENDER')}
        />
        <SubjectGroup
          title="Posso ajudar"
          subjects={subjects.filter((item) => item.interestType === 'DOMINA')}
        />
      </div>
    </section>
  )
}

export default ProfileSubjects
