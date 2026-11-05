import { useNavigate, useOutletContext } from 'react-router'
import OptionList from '../../components/common/OptionList.jsx'
import AccountSummaryCard from '../../components/user/AccountSummaryCard.jsx'
import { mockSettingsSections } from '../../data/mockSettingsOptions.js'

function SettingsPage() {
  const navigate = useNavigate()
  const { currentUser } = useOutletContext()

  function handleSelect(action) {
    if (action === 'logout') {
      // Sem autenticação integrada, sair apenas volta para a tela de acesso.
      navigate('/login', { replace: true })
    }
  }

  return (
    <section aria-labelledby="settings-title" className="space-y-5">
      <h1
        id="settings-title"
        className="text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
      >
        Configurações
      </h1>

      <AccountSummaryCard user={currentUser} to="/perfil" />

      {mockSettingsSections.map((section) => (
        <OptionList
          key={section.id}
          id={section.id}
          title={section.title}
          items={section.items}
          onSelect={handleSelect}
        />
      ))}
    </section>
  )
}

export default SettingsPage
