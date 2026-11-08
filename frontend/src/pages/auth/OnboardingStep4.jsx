import {useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import SubjectInterestPicker from '../../components/user/SubjectInterestPicker.jsx'
import { mockSubjects } from '../../data/mockSubjects.js'

// Mesmo catálogo e seletor usados no Editar perfil. Como o semestre da
// Etapa 3 ainda não é guardado entre as etapas, sugerimos as disciplinas do
// 1º semestre (o mesmo que o Editar perfil faz sem semestre informado);
// "Ver mais" abre a lista completa com busca.
const featuredSubjectIds = mockSubjects
  .filter((subject) => subject.semester === 1)
  .map((subject) => subject.id)

function OnboardingStep4Page() {
  // Lista de { subject, interestType }, no mesmo formato do Editar perfil.
  const [subjects, setSubjects] = useState([])
  const [done, setDone] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    // Os dois grupos são opcionais. O envio à API ainda precisa ser conectado.
    setDone(true)
  }

  if (done) return <Navigate to="/onboarding/etapa-5" />

  return (
    <AuthLayout>
      <div
        className="onboarding-progress"
        role="progressbar"
        aria-label="Progresso do cadastro"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={80}
      >
        <div className="onboarding-progress-bar" style={{width: '80%'}} />
      </div>

      <AuthForm
        eyebrow="ETAPA 4 DE 5"
        title="Seus interesses"
        description="Você poderá completar ou alterar essas informações depois."
        fields={[]}
        submitLabel="Avançar"
        canSubmit
        onSubmit={handleSubmit}
        actions={{
          start: (
            <Link className="text-button" to="/onboarding/etapa-3">
              Voltar
            </Link>
          ),
          extra: (
            <Link className="text-button skip-button" to="/onboarding/etapa-5">
              Pular
            </Link>
          ),
        }}
      >
        <SubjectInterestPicker
          subjects={mockSubjects}
          value={subjects}
          featuredIds={featuredSubjectIds}
          onChange={setSubjects}
        />
      </AuthForm>
    </AuthLayout>
  )
}

export default OnboardingStep4Page