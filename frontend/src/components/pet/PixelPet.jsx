import { PIXEL_COLORS } from '../../data/petStages.js'

// Tamanho, em pixels do desenho, da maior fase. Como a área é sempre a mesma,
// as fases menores aparecem de fato menores na tela.
const CANVAS_SIZE = 30

// Desenha o sprite em SVG, um quadrado por pixel, sem borrar ao ampliar.
function PixelPet({ sprite, label, className }) {
  const width = sprite[0].length
  const offsetX = Math.floor((CANVAS_SIZE - width) / 2)
  // Alinha pela base, para todas as fases ficarem "em pé no chão".
  const offsetY = CANVAS_SIZE - sprite.length

  return (
    <svg
      viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      className={className}
    >
      {sprite.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          PIXEL_COLORS[pixel] ? (
            <rect
              key={`${x}-${y}`}
              x={offsetX + x}
              y={offsetY + y}
              width="1"
              height="1"
              fill={PIXEL_COLORS[pixel]}
            />
          ) : null,
        ),
      )}
    </svg>
  )
}

export default PixelPet
