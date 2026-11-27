// Fases do bichinho e regra de evolução.
//
// Para chegar à fase de índice k é preciso ter 3 × k² respostas. O custo cresce
// mais rápido que uma reta e bem mais devagar que uma exponencial: cada fase
// pede 6 respostas a mais que o salto anterior (+3, +9, +15).
const GROWTH_BASE = 3
const GROWTH_EXPONENT = 2

export function answersRequired(stageIndex) {
  return Math.round(GROWTH_BASE * stageIndex ** GROWTH_EXPONENT)
}

// Pixel art: cada letra é um pixel.
// O contorno · . vazio · L laranja · E laranja escuro · B barriga
// P olho · W brilho do olho · C casca do ovo · S sombra da casca
export const PIXEL_COLORS = {
  O: '#4a2312',
  L: '#f5862e',
  E: '#c85a17',
  B: '#ffd59a',
  P: '#24130b',
  W: '#ffffff',
  C: '#fbf1dc',
  S: '#dcc7a0',
}

const stages = [
  {
    // Fase 1: filhote saindo do ovo
    sprite: [
      '................',
      '......OOOOO.....',
      '.....OLLLLLO....',
      '....OLLLLLLLO...',
      '....OLWPLLLLO...',
      '....OLPPLLLLLO..',
      '....OLLLLLLLLO..',
      '.....OLLOOOOO...',
      '...O.OLLLLO.O...',
      '..OCOCOLLOCOCO..',
      '..OCCCCOOCCCCO..',
      '..OCCCCCCCCCSO..',
      '..OCCCCCCCCCSO..',
      '...OCCCCCCCSO...',
      '....OSSSSSSO....',
      '.....OOOOOO.....',
    ],
  },
  {
    // Fase 2: bebê
    sprite: [
      '....................',
      '.........OOOOOO.....',
      '........OLLLLLLO....',
      '.......OLLLLLLLLO...',
      '.......OLLLWPLLLO...',
      '......OELLLPPLLLLO..',
      '.......OLLLLLLLLLO..',
      '......OELLLLOOOOO...',
      '.......OLLLLO.......',
      '..O...OELBBLLO......',
      '.OLO.OLLBBBLOLO.....',
      '.OLLOLLLBBBLOO......',
      '..OLLLLLBBBLO.......',
      '...OLLLLLBBLO.......',
      '....OOLLOOLLO.......',
      '.....OLLOOLLO.......',
      '.....OOOO.OOOO......',
      '....................',
    ],
  },
  {
    // Fase 3: jovem
    sprite: [
      '........................',
      '............OOOOOOOO....',
      '...........OLLLLLLLLO...',
      '..........OLLLLLLLLLLO..',
      '.........OELLLLWPLLLLO..',
      '..........OLLLLPPLLLLLO.',
      '.........OELLLLLLLLLLLO.',
      '..........OLLLLLLOOOOO..',
      '.........OELLLLLLLLO....',
      '..........OLLLLOOOO.....',
      '.O.......OELLBBO........',
      'OLO.....OELLBBBLOOO.....',
      'OLLO...OELLLBBBLLLLO....',
      'OLLLO.OELLLBBBBLOOLO....',
      '.OLLLOOLLLLBBBBLO.O.....',
      '..OLLLLLLLLBBBBLO.......',
      '...OLLLLLLLLBBLO........',
      '....OOOLLLLLLLLO........',
      '.......OLLLOLLLO........',
      '.......OLLO.OLLO........',
      '.......OLLO.OLLO........',
      '.......OLLLOOLLLO.......',
      '.......OOOOOOOOOO.......',
      '........................',
    ],
  },
  {
    // Fase 4: adulto
    sprite: [
      '..............................',
      '................OOOOOOOOOO....',
      '...............OLLLLLLLLLLO...',
      '.............OOLLLLLLLLLLLLO..',
      '............OELLLLLWWPLLLLLLO.',
      '.............OLLLLLWPPLLLLLLO.',
      '............OELLLLLLLLLLLLLLO.',
      '.............OLLLLLLLLLLLLLLO.',
      '............OELLLLLLOWOWOWOO..',
      '.............OLLLLLLLOOOOOO...',
      '............OELLLLLLLLLLO.....',
      '...........OELLLLLOOOOOO......',
      '..........OELLLLBBBO..........',
      '.O.......OELLLLBBBBLOOOO......',
      'OLO.....OELLLLBBBBBLLLLLO.....',
      'OLO....OELLLLLBBBBBLOOLLO.....',
      'OLLO..OELLLLLBBBBBBLO.OOO.....',
      'OLLLOOELLLLLLBBBBBBLO.........',
      '.OLLLELLLLLLLBBBBBBLO.........',
      '..OLLLLLLLLLLLBBBBLO..........',
      '...OLLLLLLLLLLBBBBLO..........',
      '....OOLLLLLLLLLBBLO...........',
      '......OOOLLLLLLLLLO...........',
      '.........OLLLLOLLLLO..........',
      '.........OLLLO.OLLLO..........',
      '.........OLLLO.OLLLO..........',
      '.........OLLLO.OLLLO..........',
      '.........OLLLLOOLLLLO.........',
      '.........OOOOOOOOOOOO.........',
      '..............................',
    ],
  },
]

export const PET_STAGES = stages.map((stage, index) => ({
  ...stage,
  requiredAnswers: answersRequired(index),
}))

// Fase atual, a próxima (null na última) e quanto falta para chegar nela.
export function getPetProgress(answerCount) {
  const stageIndex = PET_STAGES.findLastIndex((stage) => answerCount >= stage.requiredAnswers)
  const index = Math.max(0, stageIndex)
  const stage = PET_STAGES[index]
  const nextStage = PET_STAGES[index + 1] ?? null
  if (!nextStage) return { index, stage, nextStage, remaining: 0, ratio: 1 }

  const span = nextStage.requiredAnswers - stage.requiredAnswers
  return {
    index,
    stage,
    nextStage,
    remaining: nextStage.requiredAnswers - answerCount,
    ratio: (answerCount - stage.requiredAnswers) / span,
  }
}
