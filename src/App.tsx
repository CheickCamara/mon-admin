import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Influenceurs from './pages/Influenceurs'
import Candidatures from './pages/Candidatures'
import Restaurants from './pages/Restaurants'
import Offres from './pages/Offres'
import { getToken, clearToken } from './api'
import './App.css'

type Page = 'dashboard' | 'influenceurs' | 'candidatures' | 'restaurants' | 'offres'

const NAV = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'influenceurs', label: '👤 Influenceurs' },
  { id: 'candidatures', label: '📋 Candidatures' },
  { id: 'restaurants', label: '🍽️ Restaurants' },
  { id: 'offres', label: '🎁 Offres' },
] as const

export default function App() {
  const [auth, setAuth] = useState(() => !!getToken())
  const [page, setPage] = useState<Page>('dashboard')

  const logout = () => { clearToken(); setAuth(false) }

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Pop Fluence</div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={logout}>Déconnexion</button>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && <Dashboard />}
        {page === 'influenceurs' && <Influenceurs />}
        {page === 'candidatures' && <Candidatures />}
        {page === 'restaurants' && <Restaurants />}
        {page === 'offres' && <Offres />}
      </main>
    </div>
  )
}
