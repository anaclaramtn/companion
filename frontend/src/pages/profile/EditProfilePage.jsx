import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import FormField from '../../components/common/FormField.jsx'
import ProfileBanner, {
  BANNER_STYLES,
  DEFAULT_BANNER_COLOR,
  DEFAULT_BANNER_STYLE,
} from '../../components/user/ProfileBanner.jsx'
import SubjectInterestPicker from '../../components/user/SubjectInterestPicker.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import {
  getAllSubjects,
  getCourses,
  getCourseSubjects,
  getUniversities,
} from '../../services/academicService.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  AVATAR_ACCEPT,
  AVATAR_SIZE_MESSAGE,
  getAvatarFileError,
  getMySubjects,
  isAvatarTooLargeError,
  replaceMySubjects,
} from '../../services/profileService.js'

// Limites iguais aos do backend (UserProfileUpdateRequestDTO).
const MAX_NAME_LENGTH = 64
const MAX_BIO_LENGTH = 512

const selectClassName =
  'w-full rounded-xl border border-companion-border bg-companion-panel/80 px-4 py-3 text-sm text-companion-text outline-none transition focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15 disabled:cursor-not-allowed disabled:opacity-60'

const toFieldValue = (id) => (id == null ? '' : String(id))

// Sugere as disciplinas do semestre atual e do anterior (sem semestre
// informado, as do 1º).
function getFeaturedSubjectIds(catalog, semester) {
  const current = Number(semester) || 1
  const semesters = [current, Math.max(current - 1, 1)]
  return catalog
    .filter((subject) => semesters.includes(subject.semester))
    .map((subject) => subject.id)
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function validate(form) {
  const errors = {}
  const name = form.name.trim()

  if (!name) {
    errors.name = 'Informe seu nome.'
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`
  }

  return errors
}

function EditProfilePage() {
  const { currentUser } = useOutletContext()
  const { updateAvatar, removeAvatar, updateProfile } = useAuth()
  const showToast = useToast()
  const [form, setForm] = useState(() => ({
    name: currentUser.name ?? '',
    avatarUrl: currentUser.avatarUrl,
    bio: currentUser.bio ?? '',
    bannerStyle: currentUser.bannerStyle ?? DEFAULT_BANNER_STYLE,
    bannerColor: currentUser.bannerColor ?? DEFAULT_BANNER_COLOR,
    universityId: toFieldValue(currentUser.universityId),
    courseId: toFieldValue(currentUser.courseId),
    semester: toFieldValue(currentUser.semester),
    subjects: [],
  }))
  // Opções vindas do banco.
  const [universities, setUniversities] = useState([])
  const [courses, setCourses] = useState([])
  const [catalog, setCatalog] = useState({ courseId: null, subjects: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  // Foto escolhida e ainda não enviada; sobe para a API só ao salvar.
  const [avatarFile, setAvatarFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const isSaving = status.type === 'saving'

  // Universidades e disciplinas já salvas no perfil.
  useEffect(() => {
    let active = true
    Promise.all([getUniversities(), getMySubjects()])
      .then(([universityList, mySubjects]) => {
        if (!active) return
        setUniversities(universityList)
        setForm((current) => ({
          ...current,
          subjects: mySubjects,
          // Com uma só universidade cadastrada, ela já vem escolhida.
          universityId:
            current.universityId ||
            (universityList.length === 1 ? String(universityList[0].id) : ''),
        }))
      })
      .catch((error) => {
        if (active) setLoadError(getApiErrorMessage(error, 'Não foi possível carregar seu perfil.'))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Cursos da universidade escolhida.
  const { universityId, courseId } = form
  useEffect(() => {
    if (!universityId) return undefined
    let active = true
    getCourses(universityId)
      .then((list) => {
        if (active) setCourses(list)
      })
      .catch((error) => {
        if (active) setLoadError(getApiErrorMessage(error, 'Não foi possível carregar os cursos.'))
      })
    return () => {
      active = false
    }
  }, [universityId])

  // Disciplinas que podem ser escolhidas: a grade do curso ou, sem curso, todas.
  useEffect(() => {
    let active = true
    const request = courseId ? getCourseSubjects(courseId) : getAllSubjects()
    request
      .then((subjects) => {
        if (active) setCatalog({ courseId, subjects })
      })
      .catch((error) => {
        if (active) setLoadError(getApiErrorMessage(error, 'Não foi possível carregar as disciplinas.'))
      })
    return () => {
      active = false
    }
  }, [courseId])

  // A pré-visualização da foto nova usa um endereço temporário (blob:), que
  // precisa ser liberado da memória ao trocar de foto ou sair da tela.
  useEffect(() => {
    const previewUrl = form.avatarUrl
    if (!previewUrl?.startsWith('blob:')) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [form.avatarUrl])

  const visibleCourses = form.universityId ? courses : []
  const selectedCourse = visibleCourses.find((course) => String(course.id) === form.courseId)
  const semesterOptions = Array.from(
    { length: selectedCourse?.totalSemesters ?? 0 },
    (_, index) => index + 1,
  )
  const isCatalogCurrent = catalog.courseId === form.courseId

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus({ type: 'idle', message: '' })
  }

  function handleUniversityChange(value) {
    setCourses([])
    setForm((current) => ({ ...current, universityId: value, courseId: '', semester: '' }))
    setStatus({ type: 'idle', message: '' })
  }

  function handleCourseChange(value) {
    const course = courses.find((item) => String(item.id) === value)
    setForm((current) => ({
      ...current,
      courseId: value,
      // Descarta um semestre que não existe no curso novo.
      semester: course && Number(current.semester) <= course.totalSemesters ? current.semester : '',
    }))
    setStatus({ type: 'idle', message: '' })
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const fileError = getAvatarFileError(file)
    if (fileError) {
      showToast(fileError, { type: 'error' })
      return
    }

    setAvatarFile(file)
    updateField('avatarUrl', URL.createObjectURL(file))
  }

  function handleAvatarRemove() {
    setAvatarFile(null)
    updateField('avatarUrl', null)
  }

  // Envia a foto nova ou remove a atual pela API e devolve o endereço final.
  async function saveAvatar() {
    if (avatarFile) return (await updateAvatar(avatarFile)).avatarUrl
    if (!form.avatarUrl && currentUser.avatarUrl) {
      return (await removeAvatar()).avatarUrl
    }
    return currentUser.avatarUrl
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSaving) return
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setStatus({ type: 'error', message: 'Revise os campos destacados.' })
      return
    }

    setStatus({ type: 'saving', message: '' })
    try {
      const avatarUrl = await saveAvatar()
      setAvatarFile(null)
      setForm((current) => ({ ...current, avatarUrl }))

      // Bio vazia apaga a bio. Curso e semestre só vão quando escolhidos:
      // o backend mantém o valor atual dos campos que não são enviados.
      await updateProfile({
        name: form.name.trim(),
        bio: form.bio.trim(),
        bannerStyle: form.bannerStyle,
        ...(form.bannerStyle === 'SOLID' && { bannerColor: form.bannerColor }),
        ...(form.courseId && { courseId: Number(form.courseId) }),
        ...(form.semester && { semester: Number(form.semester) }),
      })
      await replaceMySubjects(form.subjects)
      setStatus({ type: 'success', message: 'Perfil atualizado com sucesso.' })
    } catch (saveError) {
      if (isAvatarTooLargeError(saveError)) {
        showToast(AVATAR_SIZE_MESSAGE, { type: 'error' })
        setStatus({ type: 'idle', message: '' })
        return
      }
      setStatus({
        type: 'error',
        message: getApiErrorMessage(saveError, 'Não foi possível salvar as alterações.'),
      })
    }
  }

  if (isLoading || loadError) {
    return (
      <section className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
        <p
          role={loadError ? 'alert' : 'status'}
          className={`text-sm font-semibold ${loadError ? 'text-red-700' : 'text-companion-muted'}`}
        >
          {loadError || 'Carregando seu perfil…'}
        </p>
        {loadError && (
          <Link
            to="/perfil"
            className="mt-4 inline-block rounded-xl border border-companion-border bg-companion-panel px-4 py-2 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
          >
            Voltar ao perfil
          </Link>
        )}
      </section>
    )
  }

  return (
    <section aria-labelledby="edit-profile-title" className="space-y-5">
      <div>
        <BackLink to="/perfil" label="Meu perfil" />
        <h1
          id="edit-profile-title"
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Editar perfil
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Essas informações aparecem para outros estudantes no seu perfil.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <section
          aria-labelledby="edit-profile-photo-title"
          className="flex flex-wrap items-center gap-5 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
        >
          {form.avatarUrl ? (
            <img
              src={form.avatarUrl}
              alt="Pré-visualização da foto de perfil"
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grid size-20 place-items-center rounded-full bg-companion-orange/10 text-xl font-bold text-companion-brand"
            >
              {initials(form.name || currentUser.name || '')}
            </div>
          )}
          <div>
            <h2
              id="edit-profile-photo-title"
              className="text-sm font-bold text-companion-text"
            >
              Foto de perfil
            </h2>
            <p className="mt-0.5 text-xs text-companion-muted">
              JPG, PNG ou WEBP com até 2 MB.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-companion-orange">
                <i className="bi bi-upload" aria-hidden="true" />
                Escolher foto
                <input
                  type="file"
                  accept={AVATAR_ACCEPT}
                  onChange={handleAvatarChange}
                  className="sr-only"
                />
              </label>
              {form.avatarUrl && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  className="rounded-xl border border-companion-border bg-companion-panel px-4 py-2 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="edit-profile-banner-title"
          className="space-y-4 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
        >
          <h2
            id="edit-profile-banner-title"
            className="text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand"
          >
            Banner do perfil
          </h2>
          <ProfileBanner
            style={form.bannerStyle}
            color={form.bannerColor}
            className="h-24 rounded-xl sm:h-28"
          />
          <div role="radiogroup" aria-labelledby="edit-profile-banner-title" className="flex flex-wrap gap-2">
            {BANNER_STYLES.map((option) => {
              const selected = form.bannerStyle === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => updateField('bannerStyle', option.value)}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                    selected
                      ? 'border-companion-orange bg-companion-orange/10 text-companion-brand'
                      : 'border-companion-border bg-companion-panel text-companion-text hover:bg-companion-orange/5'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          {form.bannerStyle === 'SOLID' && (
            <label className="flex items-center gap-3 text-sm font-semibold text-companion-text">
              Cor
              <input
                type="color"
                value={form.bannerColor}
                onChange={(event) => updateField('bannerColor', event.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-companion-border bg-companion-panel p-1"
              />
            </label>
          )}
        </section>

        <section
          aria-labelledby="edit-profile-info-title"
          className="space-y-4 rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
        >
          <h2
            id="edit-profile-info-title"
            className="text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand"
          >
            Informações básicas
          </h2>
          <FormField
            id="profile-name"
            label="Nome"
            value={form.name}
            maxLength={MAX_NAME_LENGTH}
            error={errors.name}
            autoComplete="name"
            onChange={(event) => updateField('name', event.target.value)}
          />
          <FormField
            id="profile-bio"
            label="Biografia"
            multiline
            rows={3}
            value={form.bio}
            maxLength={MAX_BIO_LENGTH}
            placeholder="Conte um pouco sobre você e o que está estudando..."
            onChange={(event) => updateField('bio', event.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px]">
            <div>
              <label
                htmlFor="profile-university"
                className="mb-2 block text-sm font-semibold text-companion-text"
              >
                Universidade
              </label>
              <select
                id="profile-university"
                value={form.universityId}
                onChange={(event) => handleUniversityChange(event.target.value)}
                className={selectClassName}
              >
                {!form.universityId && <option value="">Selecionar universidade</option>}
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.acronym} ({university.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="profile-course"
                className="mb-2 block text-sm font-semibold text-companion-text"
              >
                Curso
              </label>
              <select
                id="profile-course"
                value={form.courseId}
                onChange={(event) => handleCourseChange(event.target.value)}
                disabled={!form.universityId}
                className={selectClassName}
              >
                {!selectedCourse && <option value="">Selecionar curso</option>}
                {visibleCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="profile-semester"
                className="mb-2 block text-sm font-semibold text-companion-text"
              >
                Semestre
              </label>
              <select
                id="profile-semester"
                value={form.semester}
                onChange={(event) => updateField('semester', event.target.value)}
                disabled={!selectedCourse}
                className={selectClassName}
              >
                {!form.semester && <option value="">Selecionar</option>}
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}º semestre
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="edit-profile-subjects-title"
          className="rounded-2xl border border-companion-border/70 bg-companion-surface p-5 shadow-sm sm:p-6"
        >
          <h2
            id="edit-profile-subjects-title"
            className="text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand"
          >
            Matérias
          </h2>
          <p className="mb-4 mt-1 text-xs text-companion-muted">
            Toque em uma disciplina para adicioná-la ou removê-la. Cada
            disciplina pode estar em apenas um grupo. Mostramos as do seu
            semestre; use “Ver mais” para escolher qualquer outra.
          </p>
          {isCatalogCurrent ? (
            <SubjectInterestPicker
              subjects={catalog.subjects}
              value={form.subjects}
              featuredIds={getFeaturedSubjectIds(catalog.subjects, form.semester)}
              onChange={(value) => updateField('subjects', value)}
            />
          ) : (
            <p role="status" className="text-sm text-companion-muted">
              Carregando disciplinas…
            </p>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {status.message && (
            <p
              role={status.type === 'error' ? 'alert' : 'status'}
              className={`mr-auto text-sm font-semibold ${
                status.type === 'error' ? 'text-red-700' : 'text-green-700'
              }`}
            >
              {status.message}
            </p>
          )}
          <Link
            to="/perfil"
            className="rounded-xl border border-companion-border bg-companion-panel px-5 py-2.5 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
          >
            {status.type === 'success' ? 'Ver perfil' : 'Cancelar'}
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-companion-orange px-5 py-2.5 text-sm font-bold text-white shadow-companion-btn transition hover:bg-companion-orange-hover disabled:cursor-wait disabled:opacity-60"
          >
            <i className="bi bi-check-lg" aria-hidden="true" />
            {isSaving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditProfilePage
