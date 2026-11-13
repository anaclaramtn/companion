import { useState } from 'react'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import { usePostActions } from '../../hooks/usePostActions.js'

// Lixeira de uma resposta. Só aparece para o autor e para administração ou
// moderação. onDelete(replyId) deve devolver uma Promise; se falhar, o aviso de
// erro já foi mostrado e a confirmação continua aberta para tentar de novo.
function DeleteReplyButton({ reply, onDelete, className = '' }) {
  const { canModerate } = usePostActions()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!onDelete || !(reply.ownedByCurrentUser || canModerate)) return null

  async function confirmDelete() {
    setIsDeleting(true)
    try {
      await onDelete(reply.id)
      setIsOpen(false)
    } catch {
      // Mantém a janela aberta.
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Excluir resposta"
        title="Excluir resposta"
        className={`text-companion-muted transition-colors hover:text-red-600 ${className}`}
      >
        <i className="bi bi-trash" aria-hidden="true" />
      </button>
      {isOpen && (
        <ConfirmDialog
          title="Excluir esta resposta?"
          description={
            reply.ownedByCurrentUser
              ? 'A resposta deixa de aparecer para todo mundo. Essa ação não pode ser desfeita.'
              : 'Você está excluindo a resposta de outra pessoa como moderação. Essa ação não pode ser desfeita.'
          }
          confirmLabel="Excluir resposta"
          tone="danger"
          isConfirming={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => !isDeleting && setIsOpen(false)}
        />
      )}
    </>
  )
}

export default DeleteReplyButton
