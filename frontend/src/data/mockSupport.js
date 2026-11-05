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
      'Confira se o e-mail ou username e a senha estão corretos. Se esqueceu a senha, use "Recuperar senha". Contas suspensas não conseguem entrar até a análise da administração.',
  },
  {
    id: 2,
    question: 'O link de recuperação de senha não funciona',
    answer:
      'O link expira em 15 minutos e só pode ser usado uma vez. Se ele já venceu ou foi usado, faça um novo pedido de recuperação e use o link mais recente.',
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
