import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getApiErrorMessage } from '../../services/apiError.js'

// Mesmo limite do backend (UserProfileUpdateRequestDTO).
const PET_NAME_MAX_LENGTH = 20

// Bloco das Configurações para dar nome ao bichinho. Salva pela API
// (PUT /users/me/profile só com petName) e atualiza a sessão, então a lateral
// muda na hora. Salvar em branco tira o nome.
function PetNameCard({ currentUser }) {
  const { updateProfile } = useAuth()
  const showToast = useToast()
  const savedName = currentUser.petName ?? ''
  const [petName, setPetName] = useState(savedName)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const hasChanged = petName.trim() !== savedName

  async function handleSubmit(event) {
    event.preventDefault()
    if (!hasChanged || isSaving) return

    setError('')
    setIsSaving(true)
    try {
      const user = await updateProfile({ petName: petName.trim() })
      setPetName(user.petName ?? '')
      showToast(
        user.petName ? `Agora seu companheiro se chama ${user.petName}.` : 'Nome removido.',
      )
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, 'Não foi possível salvar o nome.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section
      aria-labelledby="pet-name-title"
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <h2
        id="pet-name-title"
        className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
      >
        Seu companheiro
      </h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
        <div className="min-w-0 flex-1 basis-64">
          <FormField
            id="pet-name"
            label="Nome do companheiro"
            value={petName}
            error={error}
            hint="Aparece na caixa do seu companheiro, abaixo do menu."
            maxLength={PET_NAME_MAX_LENGTH}
            autoComplete="off"
            onChange={(event) => {
              setPetName(event.target.value)
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
          {isSaving ? 'Salvando…' : 'Salvar nome'}
        </button>
      </form>
    </section>
  )
}

export default PetNameCard
