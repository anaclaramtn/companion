import { useId } from 'react'

// Estilos de banner do perfil; os valores iguais aos aceitos pelo backend.
export const BANNER_STYLES = [
  { value: 'SOLID', label: 'Cor sólida' },
  { value: 'GRADIENT', label: 'Degradê' },
  { value: 'WAVES', label: 'Ondas 1' },
  { value: 'WAVES_2', label: 'Ondas 2' },
  { value: 'WAVES_3', label: 'Ondas 3' },
]

export const DEFAULT_BANNER_STYLE = 'GRADIENT'
export const DEFAULT_BANNER_COLOR = '#c2410c'

const mix = (amount, base) =>
  `color-mix(in srgb, var(--color-primary) ${amount}%, ${base})`

// Três ondas no estilo do cabeçalho (camadas de curvas sobre uma base), mas
// com formas e cores próprias. Todas as cores derivam de --color-primary.
const stop = (offset, color) => (
  <stop offset={offset} style={{ stopColor: color }} />
)

// Ondas 1: o cabeçalho espelhado. Base escura na cor do tema, painel claro à
// direita e a onda clara na divisa entre os dois.
function WavesOne({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wave`} x1="1" y1="0" x2="0.6" y2="1">
          {stop(0, mix(55, 'white'))}
          {stop(1, mix(90, 'white'))}
        </linearGradient>
        <linearGradient id={`${id}-panel`} x1="1" y1="0" x2="0" y2="0">
          {stop(0, mix(6, 'white'))}
          {stop(1, mix(34, 'white'))}
        </linearGradient>
      </defs>
      <rect width="1060" height="160" style={{ fill: mix(30, 'black') }} />
      <path
        d="M370 0 C 300 30, 270 110, 180 160 L 100 160 C 180 110, 210 30, 260 0 Z"
        style={{ fill: mix(55, 'black') }}
        opacity="0.6"
      />
      <path
        d="M560 0 C 500 0, 445 70, 415 160 L 325 160 C 355 100, 370 35, 398 0 Z"
        fill={`url(#${id}-wave)`}
      />
      <path
        d="M1060 0 H 545 C 475 14, 425 80, 370 160 H 1060 Z"
        fill={`url(#${id}-panel)`}
      />
      <path
        d="M515 160 C 465 110, 410 90, 348 160 Z"
        style={{ fill: mix(30, 'white') }}
        opacity="0.7"
      />
      <path
        d="M30 0 C 55 28, 75 60, 110 160"
        fill="none"
        stroke="white"
        strokeWidth="1"
        opacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}

// Ondas 2: faixas largas subindo da esquerda para a direita, sobre fundo claro.
function WavesTwo({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-mid`} x1="0" y1="1" x2="1" y2="0">
          {stop(0, mix(70, 'white'))}
          {stop(1, 'var(--color-primary)')}
        </linearGradient>
      </defs>
      <rect width="1060" height="160" style={{ fill: mix(10, 'white') }} />
      <path
        d="M0 160 C 220 150, 330 50, 560 62 C 760 74, 880 14, 1060 0 L 1060 160 Z"
        style={{ fill: mix(40, 'white') }}
        opacity="0.8"
      />
      <path
        d="M0 160 C 260 160, 400 96, 620 110 C 820 124, 940 66, 1060 48 L 1060 160 Z"
        fill={`url(#${id}-mid)`}
      />
      <path
        d="M0 160 C 300 166, 480 132, 700 146 C 860 156, 960 124, 1060 116 L 1060 160 Z"
        style={{ fill: mix(40, 'black') }}
      />
      <path
        d="M0 112 C 200 96, 330 40, 540 54 C 740 68, 880 8, 1060 -4"
        fill="none"
        style={{ stroke: mix(90, 'black') }}
        strokeWidth="1"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}

// Ondas 3: arcos concêntricos saindo do canto superior direito, de escuro a claro.
function WavesThree({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-arc`} x1="1" y1="0" x2="0" y2="1">
          {stop(0, mix(80, 'white'))}
          {stop(1, 'var(--color-primary)')}
        </linearGradient>
      </defs>
      <rect width="1060" height="160" style={{ fill: mix(16, 'black') }} />
      <path
        d="M1060 0 C 860 0, 700 70, 640 160 H 1060 Z"
        style={{ fill: mix(38, 'black') }}
      />
      <path
        d="M1060 0 C 900 0, 780 60, 730 160 H 1060 Z"
        style={{ fill: mix(66, 'black') }}
      />
      <path
        d="M1060 0 C 945 0, 860 50, 830 160 H 1060 Z"
        fill={`url(#${id}-arc)`}
      />
      <path
        d="M1060 0 C 985 0, 930 40, 915 160 H 1060 Z"
        style={{ fill: mix(45, 'white') }}
        opacity="0.9"
      />
      <path
        d="M0 128 C 160 96, 300 152, 470 112 C 560 92, 600 96, 640 110"
        fill="none"
        style={{ stroke: mix(70, 'white') }}
        strokeWidth="1"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}

const WAVE_ARTS = {
  WAVES: WavesOne,
  WAVES_2: WavesTwo,
  WAVES_3: WavesThree,
}

function WavesArt({ style }) {
  const id = useId().replace(/:/g, '')
  const Art = WAVE_ARTS[style]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1060 160"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
    >
      <Art id={id} />
    </svg>
  )
}

// Banner do perfil. "color" só vale para o estilo SOLID.
function ProfileBanner({ style, color, className = '' }) {
  if (WAVE_ARTS[style]) {
    return (
      <div aria-hidden="true" className={`overflow-hidden ${className}`}>
        <WavesArt style={style} />
      </div>
    )
  }
  if (style === 'SOLID') {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ backgroundColor: color || DEFAULT_BANNER_COLOR }}
      />
    )
  }
  return <div aria-hidden="true" className={`profile-banner ${className}`} />
}

export default ProfileBanner
