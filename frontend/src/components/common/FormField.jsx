const inputClassName =
  'w-full rounded-xl border bg-white/80 px-4 py-3 text-sm text-companion-text outline-none transition placeholder:text-companion-muted/75 focus:border-companion-orange focus:ring-4 focus:ring-companion-orange/15'

// Campo de formulário com rótulo, dica, contador e mensagem de erro.
// multiline usa <textarea>; as demais props vão direto para o campo.
function FormField({
  id,
  label,
  hint,
  error,
  multiline = false,
  value,
  maxLength,
  prefix,
  ...inputProps
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(' ')
  const Field = multiline ? 'textarea' : 'input'

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-companion-text"
      >
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-3 text-sm text-companion-muted"
          >
            {prefix}
          </span>
        )}
        <Field
          id={id}
          value={value}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={[
            inputClassName,
            multiline ? 'resize-y leading-6' : '',
            prefix ? 'pl-8' : '',
            error ? 'border-red-400' : 'border-companion-border',
          ].join(' ')}
          {...inputProps}
        />
      </div>
      <div className="mt-1 flex items-start justify-between gap-4 text-xs">
        <div>
          {error ? (
            <p id={`${id}-error`} className="text-red-700">
              {error}
            </p>
          ) : (
            hint && (
              <p id={`${id}-hint`} className="text-companion-muted">
                {hint}
              </p>
            )
          )}
        </div>
        {maxLength && (
          <span className="shrink-0 text-companion-muted">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

export default FormField
