import { useCallback, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import PasswordResetCard from '../../components/user/PasswordResetCard.jsx'
import UsernameCard from '../../components/user/UsernameCard.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { deleteMyAccount } from '../../services/accountService.js'

const DELETE_CONFIRMATION_TEXT = 'EXCLUIR'

function AccountSettingsPage() {
  const navigate = useNavigate()
  const { currentUser, onProfileUpdate } = useOutletContext()
  const { logout } = useAuth()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteOpen(false)
    setDeleteConfirmation('')
  }, [])

  async function handleDeleteAccount() {
    setIsDeleting(true)
    await deleteMyAccount()
    // A exclusão ainda é simulada em accountService; a sessão é encerrada de
    // verdade para não deixar o token salvo no navegador.
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <section aria-labelledby="account-settings-title" className="space-y-5">
      <div>
        <BackLink to="/configuracoes" label="Configurações" />
        <h1
          id="account-settings-title"
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Configurações da conta
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Gerencie seu username, sua senha e sua conta.
        </p>
      </div>

      <UsernameCard currentUser={currentUser} onSaved={onProfileUpdate} />

      <PasswordResetCard id="account-password" />

      <section
        aria-labelledby="danger-title"
        className="overflow-hidden rounded-2xl border border-red-200 bg-companion-surface shadow-sm"
      >
        <h2
          id="danger-title"
          className="border-b border-red-200 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-red-600 sm:px-6"
        >
          Zona de perigo
        </h2>
        <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-companion-text">Excluir conta</p>
            <p className="mt-0.5 text-xs text-companion-muted">
              Seus dados pessoais serão anonimizados e você perderá o acesso.
              Suas dúvidas e respostas continuam visíveis, sem o seu nome.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Excluir conta
          </button>
        </div>
      </section>

      {isDeleteOpen && (
        <ConfirmDialog
          title="Excluir sua conta?"
          description="Essa ação não pode ser desfeita. Para confirmar, digite EXCLUIR abaixo."
          confirmLabel="Excluir conta"
          tone="danger"
          isConfirming={isDeleting}
          canConfirm={deleteConfirmation === DELETE_CONFIRMATION_TEXT}
          onConfirm={handleDeleteAccount}
          onCancel={closeDeleteDialog}
        >
          <label htmlFor="delete-confirmation" className="sr-only">
            Digite EXCLUIR para confirmar
          </label>
          <input
            id="delete-confirmation"
            type="text"
            autoComplete="off"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            placeholder={DELETE_CONFIRMATION_TEXT}
            className="mt-4 w-full rounded-xl border border-companion-border bg-white/80 px-4 py-3 text-sm text-companion-text outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
          />
        </ConfirmDialog>
      )}
    </section>
  )
}

export default AccountSettingsPage
