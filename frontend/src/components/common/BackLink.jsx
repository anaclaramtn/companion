import { Link, useNavigate } from 'react-router'
import { useBackTarget } from '../../hooks/useBackTarget.js'

// Link "Voltar" que leva à tela anterior e mostra o nome dela.
// to e label são o destino padrão, usado quando não há tela anterior.
function BackLink({ to, label }) {
  const navigate = useNavigate()
  const target = useBackTarget(to, label)

  function handleClick(event) {
    if (!target.isHistory) return
    // Volta pelo histórico para manter o botão "voltar" do navegador em ordem.
    event.preventDefault()
    navigate(-1)
  }

  return (
    <Link
      to={target.to}
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-companion-muted transition-colors hover:text-companion-text"
    >
      <i className="bi bi-arrow-left" aria-hidden="true" />
      {target.label}
    </Link>
  )
}

export default BackLink
