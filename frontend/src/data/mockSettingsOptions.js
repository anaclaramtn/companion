// Opções da tela de configurações (HU012). Itens sem "to" nem "action"
// aparecem como indisponíveis até a tela correspondente existir.
export const mockSettingsSections = [
  {
    id: 'account',
    title: 'Conta',
    items: [
      {
        id: 'edit-profile',
        label: 'Editar perfil',
        description: 'Nome, foto, biografia, curso e matérias.',
        icon: 'bi-person-gear',
        to: '/perfil/editar',
      },
      {
        id: 'account-info',
        label: 'Informações da conta',
        description: 'E-mail, matrícula e data de criação da conta.',
        icon: 'bi-person-vcard',
        to: '/configuracoes/conta',
      },
      {
        id: 'account-settings',
        label: 'Configurações da conta',
        description: 'Alterar username e senha, ou excluir a conta.',
        icon: 'bi-sliders',
        to: '/configuracoes/ajustes',
      },
    ],
  },
  {
    id: 'help',
    title: 'Ajuda e informações',
    items: [
      {
        id: 'faq',
        label: 'Dúvidas frequentes (FAQ)',
        description: 'Respostas sobre cadastro, posts, perfil e mais.',
        icon: 'bi-question-circle',
        to: '/faq',
      },
      {
        id: 'about',
        label: 'Sobre o Companion',
        description: 'Finalidade e funcionamento da plataforma.',
        icon: 'bi-info-circle',
        to: '/sobre',
      },
      {
        id: 'terms',
        label: 'Termos e políticas',
        description: 'Termos de uso e política de privacidade.',
        icon: 'bi-file-earmark-text',
        to: '/termos',
      },
      {
        id: 'support',
        label: 'Ajuda e suporte',
        description: 'Como obter auxílio em caso de problemas.',
        icon: 'bi-life-preserver',
        to: '/ajuda',
      },
    ],
  },
  {
    id: 'session',
    title: 'Sessão',
    items: [
      {
        id: 'logout',
        label: 'Sair da conta',
        description: 'Encerrar a sessão e voltar à tela de acesso.',
        icon: 'bi-box-arrow-right',
        action: 'logout',
        tone: 'danger',
      },
    ],
  },
]
