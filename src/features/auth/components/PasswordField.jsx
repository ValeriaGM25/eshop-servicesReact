import { useState } from 'react'

export default function PasswordField({ id, label, value, onChange, required, minLength, autoFocus }) {
  const [show, setShow] = useState(false)

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="input-group">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          autoFocus={autoFocus}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} />
        </button>
      </div>
    </div>
  )
}
