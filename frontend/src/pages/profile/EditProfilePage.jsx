import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import FormField from '../../components/common/FormField.jsx'
import SubjectInterestPicker from '../../components/user/SubjectInterestPicker.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { updateMyProfile } from '../../services/accountService.js'
import { getApiErrorMessage } from '../../services/apiError.js'
import {
  AVATAR_ACCEPT,
  AVATAR_SIZE_MESSAGE,
  getAvatarFileError,
  isAvatarTooLargeError,
} from '../../services/profileService.js'

const MAX_NAME_LENGTH = 60
const MAX_BIO_LENGTH = 512
const MAX_COURSE_LENGTH = 80
const SEMESTERS = Array.from({ length: 12 }, (_, index) => index + 1)
const LAST_GRADE_SEMESTER = 8

// Sugere as disciplinas do semestre atual e do anterior (sem semestre
// informado, as do 1º). Semestres além da grade usam os dois últimos.
function getFeaturedSubjectIds(subjects, semester) {
  const current = Math.min(Number(semester) || 1, LAST_GRADE_SEMESTER)
  const semesters = [current, Math.max(current - 1, 1)]
  return subjects
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

  if (!form.name.trim()) {
    errors.name = 'Informe seu nome.'
  }

  return errors
}

function EditProfilePage() {
  const { currentUser, currentUserSubjects, subjects, onProfileUpdate } =
    useOutletContext()
  const [form, setForm] = useState(() => ({
    name: currentUser.name,
    avatarUrl: currentUser.avatarUrl,
    bio: currentUser.bio ?? '',
    course: currentUser.course ?? '',
    semester: currentUser.semester ? String(currentUser.semester) : '',
    subjects: currentUserSubjects.map(({ subject, interestType }) => ({
      subject,
      interestType,
    })),
  }))
  const { updateAvatar, removeAvatar } = useAuth()
  const showToast = useToast()
  // Foto escolhida e ainda não enviada; sobe para a API só ao salvar.
  const [avatarFile, setAvatarFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const isSaving = status.type === 'saving'

  // A pré-visualização da foto nova usa um endereço temporário (blob:), que
  // precisa ser liberado da memória ao trocar de foto ou sair da tela.
  useEffect(() => {
    const previewUrl = form.avatarUrl
    if (!previewUrl?.startsWith('blob:')) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [form.avatarUrl])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
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

      // O resto do perfil ainda é salvo pelo mock de accountService.
      const { user, subjects: savedSubjects } = await updateMyProfile(
        currentUser,
        currentUserSubjects,
        { ...form, avatarUrl },
      )
      onProfileUpdate(user, savedSubjects)
      setStatus({ type: 'success', message: 'Perfil atualizado com sucesso.' })
    } catch (saveError) {
      const fallback = 'Não foi possível salvar as alterações.'
      if (isAvatarTooLargeError(saveError)) {
        showToast(AVATAR_SIZE_MESSAGE, { type: 'error' })
        setStatus({ type: 'idle', message: '' })
        return
      }
      setStatus({
        type: 'error',
        message: saveError.response
          ? getApiErrorMessage(saveError, fallback)
          : saveError.message || fallback,
      })
    }
  }

  return (
    <section aria-labelledby="edit-profile-title" className="mx-auto max-w-4xl space-y-5">
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
              {initials(form.name || currentUser.name)}
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
                  className="rounded-xl border border-companion-border bg-white px-4 py-2 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
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
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
            <FormField
              id="profile-course"
              label="Curso"
              value={form.course}
              maxLength={MAX_COURSE_LENGTH}
              onChange={(event) => updateField('course', event.target.value)}
            />
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
                className="w-full rounded-xl border border-companion-border bg-white/80 px-4 py-3 text-sm text-companion-text outline-none transition focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15"
              >
                <option value="">Não informar</option>
                {SEMESTERS.map((semester) => (
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
          <SubjectInterestPicker
            subjects={subjects}
            value={form.subjects}
            featuredIds={getFeaturedSubjectIds(subjects, form.semester)}
            onChange={(value) => updateField('subjects', value)}
          />
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
            className="rounded-xl border border-companion-border bg-white px-5 py-2.5 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
          >
            {status.type === 'success' ? 'Ver perfil' : 'Cancelar'}
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-companion-orange px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,133,0,0.28)] transition hover:bg-companion-orange-hover disabled:cursor-wait disabled:opacity-60"
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
