import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { normalizeUsername } from '../../services/accountService.js'
import { getApiErrorMessage } from '../../services/apiError.js'

// Mesma regra do backend (UserProfileUpdateRequestDTO).
function validateUsername(username) {
  if (!username) return 'Informe um username.'
  if (!/^[a-z0-9]{3,30}$/.test(username)) {
    return 'Use de 3 a 30 caracteres: só letras e números.'
  }
  return ''
}

// Bloco para trocar o username da conta (Configurações da conta). Salva
// pela API (PUT /users/me/profile só com o username) e atualiza a sessão.
function UsernameCard({ currentUser }) {
  const { updateProfile } = useAuth()
  const showToast = useToast()
  const [username, setUsername] = useState(currentUser.username)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const hasChanged = username !== currentUser.username

  async function handleSubmit(event) {
    event.preventDefault()
    const validationError = validateUsername(username)
    setError(validationError)
    if (validationError || !hasChanged) return

    setIsSaving(true)
    try {
      const user = await updateProfile({ username })
      showToast(`Username alterado para @${user.username}.`)
    } catch (saveError) {
      // Ex.: 409 "O username já está em uso".
      setError(getApiErrorMessage(saveError, 'Não foi possível alterar o username.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section
      aria-labelledby="username-title"
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <h2
        id="username-title"
        className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
      >
        Username
      </h2>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap items-start gap-4 p-5 sm:p-6"
      >
        <div className="min-w-0 flex-1 basis-64">
          <FormField
            id="account-username"
            label="Username"
            prefix="@"
            value={username}
            error={error}
            hint="Só letras e números. Também serve para entrar."
            autoComplete="username"
            onChange={(event) => {
              setUsername(normalizeUsername(event.target.value))
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
          {isSaving ? 'Salvando…' : 'Salvar username'}
        </button>
      </form>
    </section>
  )
}

export default UsernameCard
