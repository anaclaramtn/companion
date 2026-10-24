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
      ) : <label htmlFor={id}>{label}</label>}
      <div className="auth-input-wrap">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {trailing && <span className="auth-input-trailing">{trailing}</span>}
      </div>
    </div>
  )
}

export default AuthField
