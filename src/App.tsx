import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Influenceurs from './pages/Influenceurs'
import Candidatures from './pages/Candidatures'
import Restaurants from './pages/Restaurants'
import './App.css'

type Page = 'dashboard' | 'influenceurs' | 'candidatures' | 'restaurants'

const NAV = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'influenceurs', label: '👤 Influenceurs' },
  { id: 'candidatures', label: '📋 Candidatures' },
  { id: 'restaurants', label: '🍽️ Restaurants' },
] as const

export default function App() {
  const [auth, setAuth] = useState(false)
  const [page, setPage] = useState<Page>('dashboard')

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
        <button className="logout-btn" onClick={() => setAuth(false)}>Déconnexion</button>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && <Dashboard />}
        {page === 'influenceurs' && <Influenceurs />}
        {page === 'candidatures' && <Candidatures />}
        {page === 'restaurants' && <Restaurants />}
      </main>
    </div>
  )
}
