// Termos de Uso e Política de Privacidade do Companion.
//
// updatedAt é a versão do documento e precisa ser igual a TERMS_VERSION em
// backend/.../services/UserService.java: o backend guarda essa versão quando a
// pessoa aceita os termos no cadastro. Ao mudar o texto, mude as duas datas.
export const terms = {
  updatedAt: '2026-11-17',
  sections: [
    {
      id: 'sobre',
      title: 'Sobre o Companion e este documento',
      paragraphs: [
        'O Companion é uma plataforma de dúvidas e trocas acadêmicas entre estudantes de Ciência da Computação da Universidade de Fortaleza, desenvolvida como projeto acadêmico.',
        'Este documento reúne os Termos de Uso e a Política de Privacidade. Ele explica as regras da plataforma e como tratamos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).',
      ],
    },
    {
      id: 'aceitacao',
      title: 'Aceitação e cadastro',
      paragraphs: [
        'Para criar uma conta é obrigatório aceitar estes Termos e a Política de Privacidade. Se não concordar com alguma parte, não crie a conta nem utilize a plataforma.',
        'O cadastro exige um e-mail institucional (@edu.unifor.br). Registramos a data e a versão do documento que você aceitou, como comprovação do seu consentimento.',
        'Você é responsável por manter sua senha em sigilo e por tudo o que for feito na sua conta.',
      ],
    },
    {
      id: 'conduta',
      title: 'Uso da plataforma',
      paragraphs: [
        'O Companion é um espaço para dúvidas e trocas acadêmicas. Publique conteúdos relacionados às matérias do curso e trate os colegas com respeito.',
        'Não é permitido publicar spam, conteúdo ofensivo, discriminatório, ilegal ou que viole direitos de terceiros, nem compartilhar respostas de avaliações em andamento.',
      ],
    },
    {
      id: 'conteudo',
      title: 'Conteúdo publicado',
      paragraphs: [
        'Você continua sendo o autor das dúvidas, respostas e comentários que publica, mas autoriza que eles sejam exibidos para os demais usuários da plataforma.',
        'Publicações não podem ser editadas depois de enviadas. Você pode excluir o seu próprio conteúdo a qualquer momento.',
      ],
    },
    {
      id: 'moderacao',
      title: 'Denúncias e moderação',
      paragraphs: [
        'Qualquer usuário pode denunciar conteúdos que considere inadequados. As denúncias são analisadas pela equipe de moderação.',
        'Conteúdos que violem estes termos podem ser removidos, e contas podem ser suspensas ou excluídas conforme a gravidade do caso.',
      ],
    },
    {
      id: 'dados-coletados',
      title: 'Dados pessoais que coletamos',
      paragraphs: [
        'Dados da conta e do perfil: e-mail institucional, senha (guardada apenas em forma de hash), nome, username, biografia, foto, matrícula, curso, semestre e as matérias que você domina ou quer aprender.',
        'Dados de uso: dúvidas, respostas e comentários que você publica, curtidas, itens salvos, quem você segue, denúncias que você envia e tickets de suporte.',
        'Dados de controle: datas de criação e atualização da conta, data e versão do aceite destes termos.',
      ],
    },
    {
      id: 'finalidade',
      title: 'Para que usamos seus dados',
      paragraphs: [
        'Usamos os dados para criar e manter sua conta, mostrar seu perfil e suas publicações, sugerir quem domina cada matéria, moderar conteúdos, responder tickets de suporte e manter a plataforma segura.',
        'As bases legais são o seu consentimento, dado ao aceitar estes termos, e a execução do serviço que você solicitou ao criar a conta. Não usamos seus dados para publicidade e não os vendemos.',
      ],
    },
    {
      id: 'compartilhamento',
      title: 'Quem pode ver seus dados',
      paragraphs: [
        'Nome, username, foto, biografia, curso, matérias e publicações ficam visíveis para outros usuários logados. E-mail, matrícula e senha nunca são exibidos publicamente.',
        'A equipe de administração e moderação acessa os dados necessários para gerenciar contas, denúncias e tickets. Não compartilhamos seus dados com terceiros, exceto o envio de e-mails da plataforma (como a recuperação de senha), quando necessário.',
      ],
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      paragraphs: [
        'Protegemos seus dados contra acesso não autorizado: as senhas são armazenadas com hash e nunca em texto puro, o acesso usa tokens de autenticação (JWT) com validade limitada, e cada função (estudante, moderação e administração) só acessa o que lhe cabe.',
        'Nenhum sistema é totalmente imune a falhas. Se identificar qualquer problema de segurança, avise a equipe pelo ticket de suporte.',
      ],
    },
    {
      id: 'direitos',
      title: 'Seus direitos como titular dos dados',
      paragraphs: [
        'Pela LGPD, você pode a qualquer momento: confirmar que tratamos seus dados e acessá-los (em Configurações, Informações da conta); corrigi-los (em Editar perfil); excluir sua conta; revogar o consentimento; e pedir informações sobre o tratamento.',
        'Excluir a conta é um direito seu e pode ser feito em Configurações, na opção "Excluir conta". Para os demais pedidos, envie um ticket pela página de Dúvidas frequentes. Você também pode peticionar à Autoridade Nacional de Proteção de Dados (ANPD).',
      ],
    },
    {
      id: 'exclusao',
      title: 'Exclusão da conta e retenção',
      paragraphs: [
        'Mantemos seus dados enquanto sua conta existir. Ao excluir a conta, seus dados pessoais (e-mail, nome, username, foto, biografia e matrícula) são apagados ou anonimizados e a conta não pode mais ser usada.',
        'Suas dúvidas, respostas e comentários podem ser mantidos, sem identificação sua, para preservar o contexto das discussões.',
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: [
        'Dúvidas sobre estes termos ou sobre o tratamento dos seus dados podem ser enviadas à equipe do Companion por ticket, na página de Dúvidas frequentes.',
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações neste documento',
      paragraphs: [
        'Estes termos podem ser atualizados. A data da última atualização é sempre informada no topo desta página, e mudanças relevantes serão comunicadas na plataforma.',
      ],
    },
  ],
}
