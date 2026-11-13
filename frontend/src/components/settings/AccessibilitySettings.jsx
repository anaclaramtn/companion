import { useId } from 'react'
import { useTheme } from '../../hooks/useTheme.js'

const themeOptions = [
  { value: 'light', label: 'Claro', icon: 'bi-sun' },
  { value: 'dark', label: 'Escuro', icon: 'bi-moon-stars' },
]

// "swatches" mostram, em cores fixas, o destaque, o erro e o sucesso de cada
// paleta (as mesmas matizes definidas em styles/global.css).
const colorVisionOptions = [
  {
    value: 'default',
    label: 'Padrão',
    description: 'Cores originais do Companion.',
    swatches: ['#ff8500', '#dc2626', '#16a34a'],
  },
  {
    value: 'red-green',
    label: 'Protanopia e deuteranopia',
    description: 'Dificuldade com vermelho e verde. Usa azul, laranja e verde-azulado.',
    swatches: ['#0072b2', '#d55e00', '#009e73'],
  },
  {
    value: 'blue-yellow',
    label: 'Tritanopia',
    description: 'Dificuldade com azul e amarelo. Usa rosa, vermelho e verde.',
    swatches: ['#d6336c', '#c2410c', '#4d9a2a'],
  },
]

const optionClassName =
  'flex h-full cursor-pointer gap-3 rounded-xl border border-companion-border bg-companion-panel/60 px-4 py-3 text-sm transition-colors hover:bg-companion-panel/90 peer-checked:border-companion-orange peer-checked:bg-companion-orange/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-companion-orange'

function OptionGroup({
  legend,
  name,
  options,
  value,
  onChange,
  renderOption,
  gridClassName = 'sm:grid-cols-2',
  optionLayoutClassName = 'items-center',
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-bold text-companion-text">{legend}</legend>
      <div className={`grid gap-2 ${gridClassName}`}>
        {options.map((option) => (
          <label key={option.value} className="relative block">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className={`${optionClassName} ${optionLayoutClassName}`}>
              {renderOption(option)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// Seção "Acessibilidade" de Configurações: tema claro/escuro e paleta para
// daltonismo. As escolhas são aplicadas na hora e lembradas neste navegador.
function AccessibilitySettings() {
  const { theme, colorVision, setTheme, setColorVision } = useTheme()
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-hidden rounded-2xl border border-companion-border/70 bg-companion-surface shadow-sm"
    >
      <h2
        id={titleId}
        className="border-b border-companion-border/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wide text-companion-brand sm:px-6"
      >
        Acessibilidade
      </h2>

      <div className="space-y-6 px-5 py-5 sm:px-6">
        <OptionGroup
          legend="Tema"
          name="theme"
          options={themeOptions}
          value={theme}
          onChange={setTheme}
          renderOption={({ label, icon }) => (
            <>
              <i className={`bi ${icon} text-lg text-companion-brand`} aria-hidden="true" />
              <span className="font-semibold text-companion-text">{label}</span>
            </>
          )}
        />

        <OptionGroup
          legend="Cores para daltonismo"
          // As três paletas ficam lado a lado; cada cartão empilha bolinhas e texto.
          gridClassName="sm:grid-cols-3"
          optionLayoutClassName="flex-col items-start"
          name="color-vision"
          options={colorVisionOptions}
          value={colorVision}
          onChange={setColorVision}
          renderOption={({ label, description, swatches }) => (
            <>
              <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                {swatches.map((color) => (
                  <span
                    key={color}
                    className="size-5 rounded-full ring-2 ring-companion-surface"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-companion-text">{label}</span>
                <span className="mt-0.5 block text-xs text-companion-muted">{description}</span>
              </span>
            </>
          )}
        />
      </div>
    </section>
  )
}

export default AccessibilitySettings
