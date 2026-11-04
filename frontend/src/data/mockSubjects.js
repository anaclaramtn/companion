// Disciplinas do curso de Ciência da Computação da Unifor.
// id: código da disciplina; semester: semestre da grade (null = optativa).
// Quando a API existir, esta lista virá do cadastro de matérias.
export const mockSubjects = [
  // 1º semestre
  { id: 'T105', name: 'Desafios do ciberespaço', semester: 1 },
  { id: 'T161', name: 'Experimentação orientada', semester: 1 },
  { id: 'T099', name: 'Fund sist computacionais', semester: 1 },
  { id: 'T100', name: 'Modelagem prob matemática', semester: 1 },
  { id: 'T096', name: 'Postura prof com interpessoal', semester: 1 },
  { id: 'T160', name: 'Raciocínio lógico algoritmico', semester: 1 },

  // 2º semestre
  { id: 'T196', name: 'Arquitetura de computadores', semester: 2 },
  { id: 'T166', name: 'Experimentação de protótipos', semester: 2 },
  { id: 'T163', name: 'Interação humano-computador', semester: 2 },
  { id: 'T164', name: 'Programação orient objetos', semester: 2 },
  { id: 'T168', name: 'Álgebra e geom computacional', semester: 2 },

  // 3º semestre
  { id: 'T197', name: 'Desenv plataformas móveis', semester: 3 },
  { id: 'T390', name: 'Estrutura de dados', semester: 3 },
  { id: 'T193', name: 'Requisitos e mod de sistemas', semester: 3 },
  { id: 'T162', name: 'Res problemas nat discreta', semester: 3 },
  { id: 'T169', name: 'Sist ciberfísic colaborativos', semester: 3 },
  { id: 'T116', name: 'Ética em computação', semester: 3 },

  // 4º semestre
  { id: 'T203', name: 'Ambiente de dados', semester: 4 },
  { id: 'T198', name: 'Construção a. de algoritmos', semester: 4 },
  { id: 'T242', name: 'Desenv plataformas web', semester: 4 },
  { id: 'T199', name: 'Mét quant em computação', semester: 4 },
  { id: 'T200', name: 'Proj arquitetura de sistemas', semester: 4 },

  // 5º semestre
  { id: 'T113', name: 'Experiência empreendedora', semester: 5 },
  { id: 'T289', name: 'Gerenciamentos de projetos', semester: 5 },
  { id: 'T293', name: 'Modelagem em prog matemática', semester: 5 },
  { id: 'T300', name: 'Programação funcional', semester: 5 },
  { id: 'T303', name: 'Proj de sistema operacional', semester: 5 },
  { id: 'T290', name: 'Resolução prob com grafos', semester: 5 },

  // 6º semestre
  { id: 'T291', name: 'Aspectos teóricos computação', semester: 6 },
  { id: 'N394', name: 'Comput gráf realidade virtual', semester: 6 },
  { id: 'T292', name: 'Computação paralela concorrent', semester: 6 },
  { id: 'T296', name: 'Intel artificial computacional', semester: 6 },
  { id: 'T295', name: 'Investigação científica', semester: 6 },
  { id: 'T310', name: 'Projeto de redes convergentes', semester: 6 },

  // 7º semestre
  { id: 'T326', name: 'Ciência dos dados', semester: 7 },
  { id: 'T335', name: 'Computação distribuída', semester: 7 },
  { id: 'T339', name: 'Inovação soluções computacion', semester: 7 },
  { id: 'T334', name: 'Model avaliação de desempenho', semester: 7 },
  { id: 'T333', name: 'Projeto banco de dados', semester: 7 },
  { id: 'T319', name: 'Projeto final integrador I', semester: 7 },

  // 8º semestre
  { id: 'T338', name: 'Ger da implantação de sistemas', semester: 8 },
  { id: 'T337', name: 'Ger de serviços no ciberespaço', semester: 8 },
  { id: 'T138', name: 'Projeto de tecn intercursos', semester: 8 },
  { id: 'T336', name: 'Projeto final integrador II', semester: 8 },

  // Optativas
  { id: 'A900', name: 'Atividades avaliativas', semester: null },
  { id: 'G368', name: 'Responsabil social e ambiental', semester: null },
  { id: 'G770', name: 'Empreendedorismo social', semester: null },
  { id: 'H726', name: 'Arte e cultura brasileira', semester: null },
  { id: 'H799', name: 'Libras', semester: null },
  { id: 'J005', name: 'Direitos humanos', semester: null },
  { id: 'J080', name: 'Missão inter: soc arte cultura', semester: null },
  { id: 'N589', name: 'Processamento de imagens', semester: null },
  { id: 'N622', name: 'Tópicos de gestão ambiental', semester: null },
  { id: 'S801', name: 'Oratória contemporânea', semester: null },
  { id: 'T114', name: 'Técnicas de programação Linux', semester: null },
  { id: 'T117', name: 'Soluções Linux II', semester: null },
  { id: 'T118', name: 'Soluções Windows', semester: null },
  { id: 'T133', name: 'Proj apl internet das coisas', semester: null },
  { id: 'T134', name: 'Perícia forense', semester: null },
  { id: 'T135', name: 'Atividades extensionistas', semester: null },
  { id: 'T139', name: 'Téc de programação para nuvem', semester: null },
  { id: 'T143', name: 'Arquitetura da comput em nuvem', semester: null },
  { id: 'T149', name: 'Tópicos de tecn da informação', semester: null },
  { id: 'T192', name: 'Governança em sistemas de T.I.', semester: null },
  { id: 'T195', name: 'Desenvolvimento de jogos', semester: null },
  { id: 'T294', name: 'Imagem e interação', semester: null },
  { id: 'T304', name: 'Teste validação de sistemas', semester: null },
  { id: 'T320', name: 'Segurança no ciberespaço', semester: null },
  { id: 'T342', name: 'Téc de integração de sistemas', semester: null },
  { id: 'T371', name: 'Tópicos em banco de dados', semester: null },
  { id: 'T380', name: 'Tópicos em programação', semester: null },
  { id: 'T400', name: 'Tópicos em eng. software', semester: null },
  { id: 'T569', name: 'Sistemas de tempo real', semester: null },
  { id: 'T951', name: 'Sistemas inteligentes', semester: null },
  { id: 'T954', name: 'Sistemas embarcados', semester: null },
]

export function getSubjectById(id) {
  return mockSubjects.find((subject) => subject.id === id)
}
