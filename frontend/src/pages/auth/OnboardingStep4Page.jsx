import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

const subjects = [
  'Algoritmos',
  'Álgebra Linear',
  'Banco de Dados',
  'Cálculo I',
  'Cálculo II',
  'Computação Gráfica',
  'Engenharia de Software',
  'Estruturas de Dados',
  'Estatística',
  'Inteligência Artificial',
  'Lógica de Programação',
  'Matemática Discreta',
  'Programação Orientada a Objetos',
  'Programação Web',
  'Redes de Computadores',
  'Segurança da Informação',
  'Sistemas Operacionais',
]

const MAX_SELECTED = 5

function toggleItem(list, item) {
  if (list.includes(item)) {
    return list.filter((current) => current !== item)
  }

  if (list.length >= MAX_SELECTED) {
    return list
  }

  return [...list, item]
}

function OnboardingStep4Page() {
  const [mastered, setMastered] = useState([])
  const [needHelp, setNeedHelp] = useState([])
  const [done, setDone] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    // Os dois grupos são opcionais. O envio à API ainda precisa ser conectado.
    setDone(true)
  }

  if (done) return <Navigate to="/onboarding/etapa-5" />

  return (
    <AuthLayout>
      <form className="onboarding-card" onSubmit={handleSubmit} noValidate>
        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" style={{width: '80%'}} />
        </div>

        <p className="eyebrow">ETAPA 4 DE 5</p>
        <h1>Seus interesses</h1>
        <p className="description">
          Você poderá completar ou alterar essas informações depois.
        </p>

        <fieldset className="chip-group">
          <legend>
            Matérias que domino <span>{mastered.length}/{MAX_SELECTED}</span>
          </legend>
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className="chip"
              aria-pressed={mastered.includes(subject)}
              onClick={() => setMastered(toggleItem(mastered, subject))}
            >
              {subject}
            </button>
          ))}
        </fieldset>

        <fieldset className="chip-group">
          <legend>
            Matérias em que preciso de ajuda <span>{needHelp.length}/{MAX_SELECTED}</span>
          </legend>
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className="chip"
              aria-pressed={needHelp.includes(subject)}
              onClick={() => setNeedHelp(toggleItem(needHelp, subject))}
            >
              {subject}
            </button>
          ))}
        </fieldset>

        <div className="onboarding-actions">
          <Link className="text-button" to="/onboarding/etapa-3">
            Voltar
          </Link>

          <div>
            <Link className="text-button" to="/onboarding/etapa-5">
              Pular
            </Link>
            <button type="submit">Avançar</button>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default OnboardingStep4Page