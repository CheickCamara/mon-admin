import { useEffect, useState } from 'react'
import { getStats } from '../api'

type Stats = {
  influenceurs: { total: number; en_attente: number; valides: number; refuses: number }
  candidatures: { total: number; en_attente: number; posts_publies: number; honorees: number }
  restaurants: { total: number; en_attente: number }
  offres: { total: number; en_attente: number }
  inscriptions_semaine: { jour: string; nb: number }[]
}

function ActionBadge({ count }: { count: number }) {
  if (count === 0) return <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>✓</span>
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#ef4444', color: '#fff', borderRadius: '50%',
      width: 36, height: 36, fontSize: '1rem', fontWeight: 800,
      boxShadow: '0 4px 12px rgba(239,68,68,0.4)',
      animation: count > 0 ? 'pulse 2s infinite' : 'none',
    }}>{count}</span>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { getStats().then(data => { if (data?.influenceurs) setStats(data) }) }, [])

  if (!stats) return <p className="loading">Chargement…</p>

  const maxNb = Math.max(...stats.inscriptions_semaine.map(s => s.nb), 1)
  const totalActions = (stats.influenceurs.en_attente ?? 0) + (stats.restaurants.en_attente ?? 0) + (stats.offres.en_attente ?? 0) + stats.candidatures.en_attente

  return (
    <div className="page">
      <h1 className="page-title">Tableau de bord</h1>

      {/* CHIFFRES CLÉS */}
      <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#7c6e8a', marginBottom: 12 }}>
        Chiffres clés
      </p>
      <div className="kpi-grid" style={{ marginBottom: 32 }}>
        <div className="kpi kpi-blue">
          <span style={{ fontSize: '1.8rem', marginBottom: 4, display: 'block' }}>👥</span>
          <span className="kpi-num">{stats.influenceurs.total}</span>
          <span className="kpi-label">Influenceurs inscrits</span>
          <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600, marginTop: 4, display: 'block' }}>
            {stats.influenceurs.valides} validés · {stats.influenceurs.refuses} refusés
          </span>
        </div>
        <div className="kpi kpi-orange">
          <span style={{ fontSize: '1.8rem', marginBottom: 4, display: 'block' }}>🍽️</span>
          <span className="kpi-num">{stats.restaurants.total}</span>
          <span className="kpi-label">Restaurants partenaires</span>
        </div>
        <div className="kpi kpi-purple">
          <span style={{ fontSize: '1.8rem', marginBottom: 4, display: 'block' }}>📋</span>
          <span className="kpi-num">{stats.candidatures.total}</span>
          <span className="kpi-label">Candidatures totales</span>
        </div>
        <div className="kpi kpi-green">
          <span style={{ fontSize: '1.8rem', marginBottom: 4, display: 'block' }}>📸</span>
          <span className="kpi-num">{stats.candidatures.posts_publies}</span>
          <span className="kpi-label">Publications soumises</span>
        </div>
        <div className="kpi kpi-purple">
          <span style={{ fontSize: '1.8rem', marginBottom: 4, display: 'block' }}>🏆</span>
          <span className="kpi-num">{stats.candidatures.honorees ?? 0}</span>
          <span className="kpi-label">Collaborations honorées</span>
        </div>
      </div>

      {/* ACTIONS REQUISES */}
      <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#7c6e8a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        Actions requises
        {totalActions > 0 && (
          <span style={{ background: '#ef4444', color: '#fff', borderRadius: 100, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
            {totalActions} en attente
          </span>
        )}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Influenceurs à valider', count: stats.influenceurs.en_attente, icon: '👤', page: 'Influenceurs' },
          { label: 'Restaurants à valider', count: stats.restaurants.en_attente, icon: '🏪', page: 'Restaurants' },
          { label: 'Offres à valider', count: stats.offres.en_attente, icon: '🎁', page: 'Offres' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: item.count > 0 ? '0 4px 20px rgba(239,68,68,0.12)' : '0 2px 12px rgba(124,58,237,0.08)',
            border: item.count > 0 ? '2px solid rgba(239,68,68,0.3)' : '2px solid rgba(124,58,237,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a0533', margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: '0.8rem', color: '#7c6e8a', margin: 0 }}>
                  {item.count === 0 ? 'Tout est à jour ✓' : `${item.count} en attente`}
                </p>
              </div>
            </div>
            <ActionBadge count={item.count} />
          </div>
        ))}
      </div>

      {/* GRAPHIQUE */}
      <div className="card">
        <h2 className="card-title">📈 Inscriptions — 7 derniers jours</h2>
        {stats.inscriptions_semaine.length === 0 ? (
          <p className="empty">Aucune inscription cette semaine.</p>
        ) : (
          <div className="bar-chart">
            {stats.inscriptions_semaine.map(s => (
              <div className="bar-col" key={s.jour}>
                <span className="bar-val">{s.nb}</span>
                <div className="bar" style={{ height: `${(s.nb / maxNb) * 120}px` }} />
                <span className="bar-label">{s.jour ? s.jour.slice(5) : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
