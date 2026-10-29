import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

const universities = ['Universidade de Fortaleza (UNIFOR)']
const courses = ['Ciência da Computação', 'Engenharia de Software', 'Sistemas de Informação']
const semesters = [
  '1º Semestre',
  '2º Semestre',
  '3º Semestre',
  '4º Semestre',
  '5º Semestre',
  '6º Semestre',
  '7º Semestre',
  '8º Semestre',
  '9º Semestre',
  '10º Semestre',
]

function OnboardingStep3Page() {
  const [university, setUniversity] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    // Todos os campos são opcionais. O envio à API ainda precisa ser conectado.
    setDone(true)
  }

  if (done) return <Navigate to="/onboarding/etapa-4" />

  return (
    <AuthLayout>
      <form className="onboarding-card" onSubmit={handleSubmit} noValidate>
        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" style={{width: '60%'}} />
        </div>

        <p className="eyebrow">ETAPA 3 DE 5</p>
        <h1>Sua vida acadêmica</h1>
        <p className="description">
          Você poderá completar ou alterar essas informações depois.
        </p>

        <div className="form-field">
          <label htmlFor="onboarding-university">Universidade</label>
          <select
            id="onboarding-university"
            name="university"
            value={university}
            onChange={(event) => setUniversity(event.target.value)}
          >
            <option value="">Selecionar universidade</option>
            {universities.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="onboarding-course">Curso</label>
          <select
            id="onboarding-course"
            name="course"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          >
            <option value="">Selecionar curso</option>
            {courses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="onboarding-semester">Semestre</label>
          <select
            id="onboarding-semester"
            name="semester"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
          >
            <option value="">Selecionar semestre</option>
            {semesters.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="onboarding-actions">
          <Link className="text-button" to="/onboarding/etapa-2">
            Voltar
          </Link>

          <div>
            <Link className="text-button" to="/onboarding/etapa-4">
              Pular
            </Link>
            <button type="submit">Avançar</button>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default OnboardingStep3Page