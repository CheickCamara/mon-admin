import { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await login(pwd)
    if (ok) onLogin()
    else setError(true)
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1 className="login-title">Pop Fluence</h1>
        <p className="login-sub">Espace administrateur</p>
        <form onSubmit={submit}>
          <input
            type="password"
            className="login-input"
            placeholder="Mot de passe admin"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false) }}
            required
          />
          {error && <p className="login-error">Mot de passe incorrect.</p>}
          <button type="submit" className="btn-primary login-btn">Se connecter</button>
        </form>
      </div>
    </div>
  )
}
