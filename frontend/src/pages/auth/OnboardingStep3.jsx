import {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router'
import AuthForm from '../../features/auth/components/AuthForm.jsx'
import AuthLayout from '../../layouts/auth/AuthLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getCourses, getUniversities } from '../../services/academicService.js'
import {
  getRegistrationNumberError,
  normalizeRegistrationNumber,
  REGISTRATION_MAX_LENGTH,
} from '../../services/accountService.js'
import { getApiErrorMessage } from '../../services/apiError.js'

const toFieldValue = (id) => (id == null ? '' : String(id))

function OnboardingStep3Page() {
  const { user, updateProfile } = useAuth()
  const [universities, setUniversities] = useState([])
  const [courses, setCourses] = useState([])
  // Começa com o que já foi salvo, para quem volta a esta etapa.
  const [universityId, setUniversityId] = useState(toFieldValue(user?.universityId))
  const [courseId, setCourseId] = useState(toFieldValue(user?.courseId))
  const [semester, setSemester] = useState(toFieldValue(user?.semester))
  const savedRegistration = user?.registrationNumber ?? ''
  const [registration, setRegistration] = useState(savedRegistration)
  const [registrationTouched, setRegistrationTouched] = useState(false)
  const registrationError = registrationTouched
    ? getRegistrationNumberError(registration)
    : ''
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true
    getUniversities()
      .then((list) => {
        if (!active) return
        setUniversities(list)
        // Com uma só universidade cadastrada, ela já vem escolhida.
        if (list.length === 1) {
          setUniversityId((current) => current || String(list[0].id))
        }
      })
      .catch((error) => {
        if (active) setMessage(getApiErrorMessage(error, 'Não foi possível carregar as universidades.'))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Recarrega os cursos sempre que a universidade muda.
  useEffect(() => {
    if (!universityId) return undefined
    let active = true
    getCourses(universityId)
      .then((list) => {
        if (active) setCourses(list)
      })
      .catch((error) => {
        if (active) setMessage(getApiErrorMessage(error, 'Não foi possível carregar os cursos.'))
      })
    return () => {
      active = false
    }
  }, [universityId])

  const visibleCourses = universityId ? courses : []
  const selectedCourse = visibleCourses.find((course) => String(course.id) === courseId)
  const semesterOptions = Array.from(
    { length: selectedCourse?.totalSemesters ?? 0 },
    (_, index) => ({ value: String(index + 1), label: `${index + 1}º semestre` }),
  )

  function handleUniversityChange(value) {
    setUniversityId(value)
    setCourses([])
    setCourseId('')
    setSemester('')
  }

  function handleCourseChange(value) {
    setCourseId(value)
    const course = courses.find((item) => String(item.id) === value)
    // Descarta um semestre que não existe no curso novo.
    if (!course || Number(semester) > course.totalSemesters) setSemester('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    setRegistrationTouched(true)
    if (getRegistrationNumberError(registration)) return

    // Todos os campos são opcionais: só vai o que foi escolhido ou mudou.
    // Sem semestre escolhido, o campo não vai e o backend mantém o atual.
    const newRegistration = normalizeRegistrationNumber(registration)
    const changes = {
      ...(courseId && { courseId: Number(courseId) }),
      ...(courseId && semester && { semester: Number(semester) }),
      // Texto vazio apaga a matrícula salva.
      ...(newRegistration !== savedRegistration && { registrationNumber: newRegistration }),
    }
    if (Object.keys(changes).length === 0) {
      setDone(true)
      return
    }

    setMessage('')
    setIsSubmitting(true)
    try {
      await updateProfile(changes)
      setDone(true)
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Não foi possível salvar seus dados. Tente novamente.'))
    } finally {
      setIsSubmitting(false)
    }
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
            placeholder: isLoading ? 'Carregando...' : 'Selecionar universidade',
            options: universities.map((university) => ({
              value: String(university.id),
              label: `${university.acronym} (${university.name})`,
            })),
            value: universityId,
            onChange: handleUniversityChange,
            disabled: isLoading,
          },
          {
            id: 'onboarding-course',
            name: 'course',
            label: 'Curso',
            type: 'select',
            placeholder: 'Selecionar curso',
            options: visibleCourses.map((course) => ({
              value: String(course.id),
              label: course.name,
            })),
            value: courseId,
            onChange: handleCourseChange,
            disabled: !universityId,
          },
          {
            id: 'onboarding-semester',
            name: 'semester',
            label: 'Semestre',
            type: 'select',
            placeholder: 'Selecionar semestre',
            options: semesterOptions,
            value: semester,
            onChange: setSemester,
            disabled: !selectedCourse,
          },
          {
            id: 'onboarding-registration',
            name: 'registration',
            label: 'Matrícula (opcional)',
            type: 'text',
            autoComplete: 'off',
            placeholder: 'Ex.: 2510123',
            value: registration,
            error: registrationError,
            helper: 'Fica visível só para você, em Configurações.',
            onChange: (value) => {
              setRegistration(value.slice(0, REGISTRATION_MAX_LENGTH))
              setMessage('')
            },
            onBlur: () => setRegistrationTouched(true),
          },
        ]}
        submitLabel="Avançar"
        canSubmit={!isLoading}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        message={message}
        messageType="error"
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
