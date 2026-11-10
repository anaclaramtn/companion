import { useNavigate, useOutletContext } from 'react-router'
import OptionList from '../../components/common/OptionList.jsx'
import AccountSummaryCard from '../../components/user/AccountSummaryCard.jsx'
import { mockSettingsSections } from '../../data/mockSettingsOptions.js'
import { useAuth } from '../../hooks/useAuth.js'

function SettingsPage() {
  const navigate = useNavigate()
  const { currentUser } = useOutletContext()
  const { logout } = useAuth()

  function handleSelect(action) {
    if (action === 'logout') {
      // Encerra a sessão (memória e localStorage) antes de voltar ao login.
      logout()
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
