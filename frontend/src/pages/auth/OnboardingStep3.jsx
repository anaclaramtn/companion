import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'

const universities = ['UNIFOR (Universidade de Fortaleza)']
const courses = [
  'Ciência da Computação',
  'Engenharia da Computação',
  'Análise e Desenvolvimento de Sistemas',
]
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
      <div
        className="onboarding-progress"
        role="progressbar"
        aria-label="Progresso do cadastro"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={60}
      >
        <div className="onboarding-progress-bar" style={{width: '60%'}} />
      </div>

      <AuthForm
        eyebrow="ETAPA 3 DE 5"
        title="Sua vida acadêmica"
        description="Você poderá completar ou alterar essas informações depois."
        fields={[
          {
            id: 'onboarding-university',
            name: 'university',
            label: 'Universidade',
            type: 'select',
            placeholder: 'Selecionar universidade',
            options: universities,
            value: university,
            onChange: (value) => setUniversity(value),
          },
          {
            id: 'onboarding-course',
            name: 'course',
            label: 'Curso',
            type: 'select',
            placeholder: 'Selecionar curso',
            options: courses,
            value: course,
            onChange: (value) => setCourse(value),
          },
          {
            id: 'onboarding-semester',
            name: 'semester',
            label: 'Semestre',
            type: 'select',
            placeholder: 'Selecionar semestre',
            options: semesters,
            value: semester,
            onChange: (value) => setSemester(value),
          },
        ]}
        submitLabel="Avançar"
        canSubmit
        onSubmit={handleSubmit}
        actions={{
          start: (
            <Link className="text-button" to="/onboarding/etapa-2">
              Voltar
            </Link>
          ),
          extra: (
            <Link className="text-button skip-button" to="/onboarding/etapa-4">
              Pular
            </Link>
          ),
        }}
      />
    </AuthLayout>
  )
}

export default OnboardingStep3Page