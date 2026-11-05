import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import BackLink from '../../components/common/BackLink.jsx'
import InfoList from '../../components/common/InfoList.jsx'
import { getMyAccount } from '../../services/accountService.js'

const roleLabels = {
  USER: 'Estudante',
  MODERATOR: 'Moderador',
  ADMIN: 'Administrador',
}

const statusLabels = {
  ACTIVE: 'Ativa',
  SUSPENDED: 'Suspensa',
  DELETED: 'Excluída',
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function AccountInfoPage() {
  const { currentUser } = useOutletContext()
  const [reloadKey, setReloadKey] = useState(0)
  const [request, setRequest] = useState({ key: null, account: null, error: '' })
  const isLoading = request.key !== reloadKey

  useEffect(() => {
    let isCurrent = true
    getMyAccount()
      .then((account) => {
        if (isCurrent) setRequest({ key: reloadKey, account, error: '' })
      })
      .catch(() => {
        if (isCurrent) {
          setRequest({
            key: reloadKey,
            account: null,
            error: 'Não foi possível carregar as informações da conta.',
          })
        }
      })
    return () => {
      isCurrent = false
    }
  }, [reloadKey])

  const { account, error } = request

  return (
    <section aria-labelledby="account-info-title" className="space-y-5">
      <div>
        <BackLink to="/configuracoes" label="Configurações" />
        <h1
          id="account-info-title"
          className="mt-2 text-2xl font-bold tracking-tight text-companion-text sm:text-3xl"
        >
          Informações da conta
        </h1>
        <p className="mt-1 text-sm text-companion-muted">
          Dados da sua conta no Companion.
        </p>
      </div>

      <p
        role="note"
        className="flex items-center gap-2 rounded-xl bg-companion-orange/10 px-4 py-3 text-xs font-semibold text-companion-brand"
      >
        <i className="bi bi-lock" aria-hidden="true" />
        Somente você pode ver estas informações. Elas nunca aparecem no seu
        perfil público.
      </p>

      {isLoading ? (
        <p
          role="status"
          className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center text-sm font-semibold text-companion-muted"
        >
          Carregando informações…
        </p>
      ) : error ? (
        <section className="rounded-2xl border border-companion-border/70 bg-companion-surface p-8 text-center">
          <p role="alert" className="font-semibold text-companion-text">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-4 rounded-xl bg-companion-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-companion-orange-hover"
          >
            Tentar novamente
          </button>
        </section>
      ) : (
        <>
          <InfoList
            id="access"
            title="Acesso"
            items={[
              {
                id: 'email',
                label: 'E-mail',
                value: account.email,
                icon: 'bi-envelope',
                hint: 'Usado para entrar e recuperar a senha.',
              },
              {
                id: 'username',
                label: 'Username',
                value: `@${currentUser.username}`,
                icon: 'bi-at',
                hint: 'Também pode ser usado para entrar.',
              },
            ]}
          />

          <InfoList
            id="academic"
            title="Dados acadêmicos"
            items={[
              {
                id: 'enrollment',
                label: 'Matrícula',
                value: account.enrollment,
                icon: 'bi-person-vcard',
              },
              {
                id: 'course',
                label: 'Curso',
                value: currentUser.course,
                icon: 'bi-mortarboard',
              },
              {
                id: 'semester',
                label: 'Semestre',
                value: currentUser.semester
                  ? `${currentUser.semester}º semestre`
                  : '',
                icon: 'bi-calendar-week',
              },
            ]}
          />

          <InfoList
            id="status"
            title="Situação da conta"
            items={[
              {
                id: 'role',
                label: 'Tipo de conta',
                value: roleLabels[account.role] ?? account.role,
                icon: 'bi-person-badge',
              },
              {
                id: 'status',
                label: 'Status',
                value: statusLabels[account.status] ?? account.status,
                icon: 'bi-check-circle',
              },
              {
                id: 'created-at',
                label: 'Membro desde',
                value: formatDate(currentUser.createdAt),
                icon: 'bi-calendar3',
              },
            ]}
          />

          <p className="text-center text-xs text-companion-muted">
            Para alterar o username, use{' '}
            <Link
              to="/configuracoes/ajustes"
              className="font-semibold text-companion-brand hover:underline"
            >
              Configurações da conta
            </Link>
            . Curso e semestre ficam em{' '}
            <Link
              to="/perfil/editar"
              className="font-semibold text-companion-brand hover:underline"
            >
              Editar perfil
            </Link>
            .
          </p>
        </>
      )}
    </section>
  )
}

export default AccountInfoPage
