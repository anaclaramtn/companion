import { mockPublicUsers } from '../data/mockPublicUsers.js'

// Nome de cada tela, usado no link "Voltar" para dizer para onde ele leva.
// Ao criar uma rota nova em App.jsx, adicione o nome dela aqui.
const labelsByPath = {
  '/feed': 'Feed',
  '/explorar': 'Explorar',
  '/configuracoes': 'Configurações',
  '/configuracoes/conta': 'Informações da conta',
  '/configuracoes/ajustes': 'Configurações da conta',
  '/faq': 'Dúvidas frequentes',
  '/sobre': 'Sobre o Companion',
  '/ajuda': 'Ajuda e suporte',
  '/termos': 'Termos e condições',
  '/perfil': 'Meu perfil',
  '/perfil/editar': 'Editar perfil',
}

export function getRouteLabel(pathname) {
  if (labelsByPath[pathname]) return labelsByPath[pathname]

  if (pathname.startsWith('/feed/posts/')) return 'Dúvida'

  const userMatch = pathname.match(/^\/feed\/users\/(\d+)$/)
  if (userMatch) {
    // Enquanto não há API, o nome vem dos dados de exemplo.
    const user = mockPublicUsers.find((item) => item.id === Number(userMatch[1]))
    return user ? `Perfil de ${user.name}` : 'Perfil'
  }

  return 'Voltar'
}
