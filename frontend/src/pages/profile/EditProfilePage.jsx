import { useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import FormField from '../../components/common/FormField.jsx'
import SubjectInterestPicker from '../../components/user/SubjectInterestPicker.jsx'
import {
  normalizeUsername,
  updateMyProfile,
} from '../../services/accountService.js'

const MAX_NAME_LENGTH = 60
const MAX_BIO_LENGTH = 160
const MAX_COURSE_LENGTH = 80
const MAX_AVATAR_SIZE = 2 * 1024 * 1024
const SEMESTERS = Array.from({ length: 12 }, (_, index) => index + 1)

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

  if (!form.username) {
    errors.username = 'Informe um username.'
  } else if (!/^[a-z0-9._]{3,30}$/.test(form.username)) {
    errors.username =
      'Use de 3 a 30 caracteres: letras minúsculas, números, ponto ou sublinhado.'
  }

  return errors
}

function EditProfilePage() {
  const { currentUser, currentUserSubjects, subjects, onProfileUpdate } =
    useOutletContext()
  const [form, setForm] = useState(() => ({
    name: currentUser.name,
    username: currentUser.username,
    avatarUrl: currentUser.avatarUrl,
    bio: currentUser.bio ?? '',
    course: currentUser.course ?? '',
    semester: currentUser.semester ? String(currentUser.semester) : '',
    subjects: currentUserSubjects.map(({ subject, interestType }) => ({
      subject,
      interestType,
    })),
  }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const isSaving = status.type === 'saving'

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus({ type: 'idle', message: '' })
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, avatar: 'Escolha um arquivo de imagem.' }))
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setErrors((current) => ({ ...current, avatar: 'A imagem deve ter até 2 MB.' }))
      return
    }

    // Sem API de upload, a imagem fica em memória como data URL.
    const reader = new FileReader()
    reader.onload = () => {
      updateField('avatarUrl', reader.result)
      setErrors((current) => ({ ...current, avatar: undefined }))
    }
    reader.readAsDataURL(file)
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
      const { user, subjects: savedSubjects } = await updateMyProfile(
        currentUser,
        currentUserSubjects,
        form,
      )
      onProfileUpdate(user, savedSubjects)
      setStatus({ type: 'success', message: 'Perfil atualizado com sucesso.' })
    } catch (saveError) {
      setStatus({
        type: 'error',
        message: saveError.message || 'Não foi possível salvar as alterações.',
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
              JPG, PNG ou GIF com até 2 MB.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-companion-orange">
                <i className="bi bi-upload" aria-hidden="true" />
                Escolher foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="sr-only"
                />
              </label>
              {form.avatarUrl && (
                <button
                  type="button"
                  onClick={() => updateField('avatarUrl', null)}
                  className="rounded-xl border border-companion-border bg-white px-4 py-2 text-sm font-bold text-companion-text transition hover:bg-companion-orange/5"
                >
                  Remover
                </button>
              )}
            </div>
            {errors.avatar && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.avatar}
              </p>
            )}
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
          <div className="grid gap-4 sm:grid-cols-2">
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
              id="profile-username"
              label="Username"
              prefix="@"
              value={form.username}
              error={errors.username}
              hint="Letras minúsculas, números, ponto ou sublinhado."
              autoComplete="username"
              onChange={(event) =>
                updateField('username', normalizeUsername(event.target.value))
              }
            />
          </div>
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
            Toque em uma matéria para adicioná-la ou removê-la. Cada matéria
            pode estar em apenas um grupo.
          </p>
          <SubjectInterestPicker
            subjects={subjects}
            value={form.subjects}
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
