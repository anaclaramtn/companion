import { useState } from 'react'
import SubjectTag from './SubjectTag.jsx'

// Campo de busca que transforma "#texto" em etiqueta ao digitar dois espaços
// ou ao escolher uma das sugestões. O texto restante continua em query.
function TagSearchInput({
  id,
  label,
  placeholder,
  query,
  tags,
  suggestions = [],
  onQueryChange,
  onAddTag,
  onRemoveTag,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = `${id}-suggestions`
  const hasSuggestions = suggestions.length > 0
  const highlightedIndex = Math.min(activeIndex, suggestions.length - 1)

  function selectSuggestion(name) {
    onAddTag(name)
    onQueryChange(query.slice(0, query.lastIndexOf('#')))
    setActiveIndex(0)
  }

  function handleChange(event) {
    const { value } = event.target
    const hashIndex = value.lastIndexOf('#')
    const tagName = value.slice(hashIndex + 1).trim()
    setActiveIndex(0)

    if (value.endsWith('  ') && hashIndex !== -1 && tagName) {
      onAddTag(tagName)
      onQueryChange(value.slice(0, hashIndex))
      return
    }

    onQueryChange(value)
  }

  function handleKeyDown(event) {
    if (event.key === 'Backspace' && query === '' && tags.length > 0) {
      onRemoveTag(tags.length - 1)
      return
    }

    if (!hasSuggestions) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(
        (highlightedIndex + step + suggestions.length) % suggestions.length,
      )
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      selectSuggestion(suggestions[highlightedIndex])
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-companion-border/70 bg-companion-surface px-4 py-2 shadow-sm transition focus-within:border-companion-orange focus-within:ring-4 focus-within:ring-companion-orange/15">
        <i aria-hidden="true" className="bi bi-search text-companion-muted" />

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Etiquetas da busca">
            {tags.map((tag, index) => (
              <li key={tag}>
                <SubjectTag name={tag} onRemove={() => onRemoveTag(index)} />
              </li>
            ))}
          </ul>
        )}

        <input
          id={id}
          type="search"
          role="combobox"
          aria-expanded={hasSuggestions}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            hasSuggestions ? `${listId}-${highlightedIndex}` : undefined
          }
          autoComplete="off"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length > 0 ? '' : placeholder}
          className="h-8 min-w-40 flex-1 bg-transparent text-sm text-companion-text outline-none! placeholder:text-companion-muted"
        />
      </div>

      {hasSuggestions && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sugestões de matérias"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-companion-border/70 bg-companion-surface py-1 shadow-lg"
        >
          {suggestions.map((name, index) => (
            <li
              key={name}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              // mousedown evita que o campo perca o foco antes da seleção.
              onMouseDown={(event) => {
                event.preventDefault()
                selectSuggestion(name)
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={[
                'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm',
                index === highlightedIndex
                  ? 'bg-companion-orange/10 text-companion-brand'
                  : 'text-companion-text',
              ].join(' ')}
            >
              <i className="bi bi-hash" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagSearchInput
