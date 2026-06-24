import { useEffect, useState } from 'react'
import { getStats } from '../api'

type Stats = {
  influenceurs: { total: number; en_attente: number; valides: number; refuses: number }
  candidatures: { total: number; en_attente: number; posts_publies: number }
  restaurants: { total: number }
  inscriptions_semaine: { jour: string; nb: number }[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { getStats().then(setStats) }, [])

  if (!stats) return <p className="loading">Chargement…</p>

  const maxNb = Math.max(...stats.inscriptions_semaine.map(s => s.nb), 1)

  return (
    <div className="page">
      <h1 className="page-title">Tableau de bord</h1>

      <div className="kpi-grid">
        <div className="kpi kpi-blue">
          <span className="kpi-num">{stats.influenceurs.total}</span>
          <span className="kpi-label">Influenceurs inscrits</span>
        </div>
        <div className="kpi kpi-orange">
          <span className="kpi-num">{stats.influenceurs.en_attente}</span>
          <span className="kpi-label">En attente de validation</span>
        </div>
        <div className="kpi kpi-green">
          <span className="kpi-num">{stats.influenceurs.valides}</span>
          <span className="kpi-label">Comptes validés</span>
        </div>
        <div className="kpi kpi-red">
          <span className="kpi-num">{stats.influenceurs.refuses}</span>
          <span className="kpi-label">Comptes refusés</span>
        </div>
        <div className="kpi kpi-purple">
          <span className="kpi-num">{stats.candidatures.total}</span>
          <span className="kpi-label">Candidatures totales</span>
        </div>
        <div className="kpi kpi-orange">
          <span className="kpi-num">{stats.candidatures.en_attente}</span>
          <span className="kpi-label">Candidatures en attente</span>
        </div>
        <div className="kpi kpi-green">
          <span className="kpi-num">{stats.candidatures.posts_publies}</span>
          <span className="kpi-label">Posts publiés</span>
        </div>
        <div className="kpi kpi-blue">
          <span className="kpi-num">{stats.restaurants.total}</span>
          <span className="kpi-label">Restaurants partenaires</span>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Inscriptions — 7 derniers jours</h2>
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
