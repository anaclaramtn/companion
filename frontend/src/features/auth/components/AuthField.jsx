import './AuthField.css'

function AuthField({
  id,
  label,
  name,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  helper,
  labelAction,
  trailing,
  options, // para type 'select': lista de textos
  rows, // para type 'textarea'
  maxLength, // para type 'textarea'
}) {
  const describedBy = [
    helper && `${id}-helper`,
    error && `${id}-error`,
  ].filter(Boolean).join(' ') || undefined

  const controlProps = {
    id,
    name,
    value,
    required,
    onChange: (event) => onChange(event.target.value),
    onBlur,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
  }

  return (
    <div className="field-group">
      {labelAction ? (
        <div className="field-heading">
          <label htmlFor={id}>{label}</label>
          {labelAction}
        </div>
      ) : (
        <label htmlFor={id}>{label}</label>
      )}

      <div className="auth-input-wrap">
        {type === 'select' ? (
          <select {...controlProps}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            {...controlProps}
            rows={rows}
            maxLength={maxLength}
            placeholder={placeholder}
          />
        ) : (
          <input
            {...controlProps}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
          />
        )}
        {trailing && <span className="auth-input-trailing">{trailing}</span>}
      </div>

      {helper && (
        <p id={`${id}-helper`} className="auth-field-helper">
          {helper}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="auth-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default AuthField
