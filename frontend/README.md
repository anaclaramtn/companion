# Frontend do Companion

Interface web do Companion, desenvolvida com React, Vite e JavaScript.

## Tecnologias definidas

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios

Bootstrap e TypeScript não fazem parte da arquitetura atual.

## Funcionalidades previstas

- Autenticação e recuperação de senha
- Onboarding opcional
- Feed cronológico com carregamento incremental
- Criação, edição e exclusão de posts de dúvida
- Respostas, curtidas e indicação de conteúdo editado
- Destaque da resposta mais curtida e do respondente mais proficiente
- Perfis, matérias, proficiência e atividade
- Busca de posts e estudantes
- Seguidores
- FAQ
- Administração de usuários e conteúdo

## Estrutura esperada

```text
src/
├── api/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── styles/
├── App.jsx
└── main.jsx
```

O conteúdo atual de `App.jsx` ainda é o template inicial do Vite e deve ser substituído quando a implementação das telas começar.

## Execução

```bash
npm install
npm run dev
```

O ambiente oficialmente suportado nesta versão é o Google Chrome no Windows 10 e 11. Responsividade e suporte oficial a dispositivos móveis ficam como melhorias futuras.

As regras completas de arquitetura e domínio estão em [`../docs/GUIA_DESENVOLVIMENTO.md`](../docs/GUIA_DESENVOLVIMENTO.md).
