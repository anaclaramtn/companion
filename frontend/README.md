# Frontend do Companion

Interface web do Companion, desenvolvida com React, Vite e JavaScript.

## Tecnologias

- Base atual: React, Vite e JavaScript.
- Previstas para as funcionalidades: Tailwind CSS, React Router e Axios.

Bootstrap e TypeScript não fazem parte da arquitetura atual.

## Estado atual e escopo

O frontend permanece na versão visual original e não está integrado aos CRUDs
do backend. As operações da API podem ser testadas por Postman. O catálogo
normativo do produto está em [`../docs/escopo_v1.md`](../docs/escopo_v1.md).
Quando a interface for integrada, não implementar edição de posts/respostas,
threads, curtidas em respostas, resposta aceita ou funcionalidades fora da
versão 1.0.

## Estrutura esperada

```text
src/
├── api/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── pages/
│   └── auth/
├── routes/
├── services/
├── styles/
│   ├── app.css
│   └── global.css
├── App.jsx
└── main.jsx
```

Os diretórios estão preparados para receber as funcionalidades. A primeira versão visual da página de login está em `src/pages/auth/LoginPage.jsx`, com estilos em `src/styles/app.css`. As ações exibem um aviso local; autenticação, cadastro e recuperação de senha ainda precisam de integração. Acesso com Google está fora da versão 1.0.

## Execução

```bash
npm install
npm run dev
```

O ambiente oficialmente suportado nesta versão é o Google Chrome no Windows 10 e 11. Responsividade e suporte oficial a dispositivos móveis ficam como melhorias futuras.

As regras completas de arquitetura e domínio estão em [`../docs/guia_desenvolvimento.md`](../docs/guia_desenvolvimento.md).
