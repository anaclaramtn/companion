import {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import SubjectInterestPicker from '../../components/user/SubjectInterestPicker.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getAllSubjects, getCourseSubjects } from '../../services/academicService.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import { getMySubjects, replaceMySubjects } from '../../services/profileService.js'

// Sugere as disciplinas do semestre atual e do anterior (sem semestre
// informado, as do 1º), como no Editar perfil. "Ver mais" abre a lista
// completa com busca.
function getFeaturedSubjectIds(catalog, semester) {
  const current = Number(semester) || 1
  const semesters = [current, Math.max(current - 1, 1)]
  return catalog
    .filter((subject) => semesters.includes(subject.semester))
    .map((subject) => subject.id)
}

function OnboardingStep4Page() {
  const { user } = useAuth()
  const courseId = user?.courseId
  // Disciplinas que podem ser escolhidas: a grade do curso da Etapa 3 ou,
  // sem curso, todas as cadastradas.
  const [catalog, setCatalog] = useState([])
  // Lista de { subject, interestType }, no mesmo formato do Editar perfil.
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([
      courseId ? getCourseSubjects(courseId) : getAllSubjects(),
      getMySubjects(),
    ])
      .then(([catalogList, mySubjects]) => {
        if (!active) return
        setCatalog(catalogList)
        setSubjects(mySubjects)
      })
      .catch((error) => {
        if (!active) return
        setLoadFailed(true)
        setMessage(getApiErrorMessage(error, 'Não foi possível carregar as disciplinas.'))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [courseId])

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    setMessage('')
    setIsSubmitting(true)
    try {
      // Os dois grupos são opcionais; a lista vazia também é salva.
      await replaceMySubjects(subjects)
      setDone(true)
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Não foi possível salvar suas disciplinas. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
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
        canSubmit={!isLoading && !loadFailed}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
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
        {isLoading && <p className="helper">Carregando disciplinas...</p>}

        {!isLoading && !loadFailed && (
          <>
            {!courseId && (
              <p className="helper" style={{margin: '0 0 0.75rem', color: '#777783', fontSize: '0.85rem'}}>
                Escolha seu curso na etapa anterior para ver as disciplinas da
                sua grade separadas por semestre.
              </p>
            )}
            <SubjectInterestPicker
              subjects={catalog}
              value={subjects}
              featuredIds={getFeaturedSubjectIds(catalog, user?.semester)}
              onChange={setSubjects}
            />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  )
}

export default OnboardingStep4Page
