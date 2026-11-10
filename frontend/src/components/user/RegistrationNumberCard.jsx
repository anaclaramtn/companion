import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import {
  getRegistrationNumberError,
  normalizeRegistrationNumber,
  REGISTRATION_MAX_LENGTH,
} from '../../services/accountService.js'
import { getApiErrorMessage } from '../../services/apiError.js'

// Bloco para cadastrar, trocar ou apagar a matrícula (Configurações da
// conta). Salva pela API (PUT /users/me/profile só com a matrícula; texto
// vazio apaga) e atualiza a sessão. Matrícula em uso volta como erro da API.
function RegistrationNumberCard({ currentUser }) {
  const { updateProfile } = useAuth()
  const showToast = useToast()
  const savedRegistration = currentUser.registrationNumber ?? ''
  const [registration, setRegistration] = useState(savedRegistration)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const hasChanged = normalizeRegistrationNumber(registration) !== savedRegistration

  async function handleSubmit(event) {
    event.preventDefault()
    const validationError = getRegistrationNumberError(registration)
    setError(validationError)
    if (validationError || !hasChanged || isSaving) return

    setIsSaving(true)
    try {
      const user = await updateProfile({
        registrationNumber: normalizeRegistrationNumber(registration),
      })
      setRegistration(user.registrationNumber ?? '')
      showToast(user.registrationNumber ? 'Matrícula salva.' : 'Matrícula removida.')
    } catch (saveError) {
      // Ex.: 409 "A matrícula já está em uso".
      setError(getApiErrorMessage(saveError, 'Não foi possível salvar a matrícula.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section
      aria-labelledby="registration-title"
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <h2
        id="registration-title"
        className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
      >
        Matrícula
      </h2>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap items-start gap-4 p-5 sm:p-6"
      >
        <div className="min-w-0 flex-1 basis-64">
          <FormField
            id="account-registration"
            label="Matrícula"
            value={registration}
            error={error}
            placeholder="Ex.: 2510123"
            hint="Opcional e visível só para você. Deixe vazio e salve para apagar."
            autoComplete="off"
            onChange={(event) => {
              setRegistration(event.target.value.slice(0, REGISTRATION_MAX_LENGTH))
              setError('')
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSaving || !hasChanged}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-companion-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-companion-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="bi bi-check-lg" aria-hidden="true" />
          {isSaving ? 'Salvando…' : 'Salvar matrícula'}
        </button>
      </form>
    </section>
  )
}

export default RegistrationNumberCard
