// Atalhos exibidos em Ajuda e suporte, no mesmo formato de OptionList.
export const mockSupportShortcuts = [
  {
    id: 'faq',
    label: 'Dúvidas frequentes (FAQ)',
    description: 'Respostas rápidas sobre o uso da plataforma.',
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
]

export const mockSupportTopics = [
  {
    id: 1,
    question: 'Não consigo entrar na minha conta',
    answer:
      'Entre com seu e-mail institucional (o username não vale para o login). Se esqueceu a senha, use "Esqueceu a senha?" na tela de login. Contas suspensas não conseguem entrar até a análise da administração.',
  },
  {
    id: 2,
    question: 'Posso recuperar ou alterar minha senha?',
    answer:
      'Sim. Na tela de login, use "Esqueceu a senha?". Se já estiver conectado, use o botão "Enviar link" em Configurações. Você receberá um e-mail para criar a nova senha.',
  },
  {
    id: 3,
    question: 'Não consigo publicar minha dúvida',
    answer:
      'Verifique se o título, o conteúdo e pelo menos uma matéria foram preenchidos e se o texto tem até 256 caracteres.',
  },
  {
    id: 4,
    question: 'Encontrei um conteúdo inadequado',
    answer:
      'Use a opção de denúncia na dúvida ou na resposta e escolha o motivo. A moderação analisa cada denúncia e decide o que fazer com o conteúdo.',
  },
]
