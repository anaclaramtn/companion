import companionLogo from '../../assets/icon_companion.png'
import BackLink from '../../components/common/BackLink.jsx'

const features = [
  {
    id: 'questions',
    icon: 'bi-chat-square-text',
    title: 'Tire dúvidas',
    description: 'Publique dúvidas sobre as matérias do curso e receba respostas dos colegas.',
  },
  {
    id: 'answers',
    icon: 'bi-people',
    title: 'Ajude a comunidade',
    description: 'Responda dúvidas de outros estudantes sobre o que você já domina.',
  },
  {
    id: 'explore',
    icon: 'bi-search',
    title: 'Encontre por matéria',
    description: 'Pesquise dúvidas e estudantes pelos assuntos que você está estudando.',
  },
  {
    id: 'follow',
    icon: 'bi-person-plus',
    title: 'Acompanhe colegas',
    description: 'Siga quem estuda os mesmos assuntos e veja seus perfis públicos.',
  },
]

function AboutPage() {
  return (
    <section aria-labelledby="about-title" className="space-y-5">
      <BackLink to="/configuracoes" label="Configurações" />

      <header className="rounded-2xl border border-companion-border/70 bg-companion-surface px-6 py-10 text-center shadow-sm">
        <img
          src={companionLogo}
          alt=""
          className="mx-auto size-20 object-contain"
        />
        <h1
          id="about-title"
          className="mt-4 text-sm font-extrabold tracking-[0.2em] text-companion-brand"
        >
          COMPANION
        </h1>
        <p className="mx-auto mt-3 max-w-md text-2xl font-bold tracking-tight text-companion-text">
          Aprender junto fica mais fácil.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-companion-muted">
          O Companion é uma rede social acadêmica feita para estudantes de
          Ciência da Computação da Universidade de Fortaleza. Um espaço para
          compartilhar dúvidas, trocar conhecimento e se conectar com quem está
          estudando os mesmos assuntos que você.
        </p>
      </header>

      <section
        aria-labelledby="about-features-title"
        className="rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
      >
        <h2
          id="about-features-title"
          className="text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand"
        >
          O que você pode fazer
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature.id} className="flex gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-companion-orange/10 text-lg text-companion-brand"
              >
                <i className={`bi ${feature.icon}`} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-companion-text">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-companion-muted">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-companion-muted">
        Companion · Versão 1.0 · Universidade de Fortaleza
      </p>
    </section>
  )
}

export default AboutPage
