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
  labelAction,
  trailing,
}) {
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
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {trailing && <span className="auth-input-trailing">{trailing}</span>}
      </div>

      {error && (
        <p id={`${id}-error`} className="auth-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default AuthField