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
}) {
  const describedBy = [
    helper && `${id}-helper`,
    error && `${id}-error`,
  ].filter(Boolean).join(' ') || undefined

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
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
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
