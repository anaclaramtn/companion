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
        description: 'Nome, username, foto, biografia, curso e matérias.',
        icon: 'bi-person-gear',
      },
      {
        id: 'account-info',
        label: 'Informações da conta',
        description: 'E-mail, matrícula e data de criação da conta.',
        icon: 'bi-person-vcard',
      },
      {
        id: 'account-settings',
        label: 'Configurações da conta',
        description: 'Senha, privacidade e preferências da plataforma.',
        icon: 'bi-sliders',
      },
    ],
  },
  {
    id: 'community',
    title: 'Comunidade',
    items: [
      {
        id: 'users',
        label: 'Informações de usuários',
        description: 'Encontre estudantes e veja seus perfis públicos.',
        icon: 'bi-people',
        to: '/explorar',
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
      },
      {
        id: 'about',
        label: 'Sobre o Companion',
        description: 'Finalidade e funcionamento da plataforma.',
        icon: 'bi-info-circle',
      },
      {
        id: 'terms',
        label: 'Termos e políticas',
        description: 'Termos de uso e política de privacidade.',
        icon: 'bi-file-earmark-text',
      },
      {
        id: 'support',
        label: 'Ajuda e suporte',
        description: 'Como obter auxílio em caso de problemas.',
        icon: 'bi-life-preserver',
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
