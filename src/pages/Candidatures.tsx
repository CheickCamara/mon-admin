import { useEffect, useState } from 'react'
import { getCandidatures, updateCandidature } from '../api'

type Candidature = {
  id: number
  influenceur_nom: string
  reseau: string
  abonnes: number
  restaurant_nom: string
  statut: string
  post_publie: number
  date_candidature: string
}

const STATUT_LABEL: Record<string, string> = {
  en_attente: '⏳ En attente',
  valide: '✅ Validée',
  refuse: '❌ Refusée',
}

export default function Candidatures() {
  const [liste, setListe] = useState<Candidature[]>([])
  const [filtre, setFiltre] = useState('tous')

  const load = () => getCandidatures().then(setListe)
  useEffect(() => { load() }, [])

  const setStatut = async (id: number, statut: string) => {
    await updateCandidature(id, { statut })
    load()
  }

  const togglePost = async (id: number, actuel: number) => {
    await updateCandidature(id, { post_publie: actuel === 0 })
    load()
  }

  const affichées = filtre === 'tous' ? liste : liste.filter(c => c.statut === filtre)

  return (
    <div className="page">
      <h1 className="page-title">Candidatures</h1>

      <div className="filters">
        {['tous', 'en_attente', 'valide', 'refuse'].map(f => (
          <button key={f} className={`filter-btn ${filtre === f ? 'active' : ''}`} onClick={() => setFiltre(f)}>
            {f === 'tous' ? 'Toutes' : STATUT_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Influenceur</th>
              <th>Réseau</th>
              <th>Abonnés</th>
              <th>Restaurant</th>
              <th>Statut</th>
              <th>Post publié</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {affichées.length === 0 && (
              <tr><td colSpan={8} className="empty">Aucune candidature.</td></tr>
            )}
            {affichées.map(c => (
              <tr key={c.id}>
                <td><strong>{c.influenceur_nom}</strong></td>
                <td><span className="tag">{c.reseau}</span></td>
                <td>{c.abonnes.toLocaleString('fr-FR')}</td>
                <td>{c.restaurant_nom}</td>
                <td><span className={`badge badge-${c.statut}`}>{STATUT_LABEL[c.statut]}</span></td>
                <td>
                  <button
                    className={`btn-action ${c.post_publie ? 'btn-green' : 'btn-gray'}`}
                    onClick={() => togglePost(c.id, c.post_publie)}
                  >
                    {c.post_publie ? '✅ Publié' : '⬜ Non publié'}
                  </button>
                </td>
                <td>{new Date(c.date_candidature).toLocaleDateString('fr-FR')}</td>
                <td className="actions">
                  {c.statut !== 'valide' && (
                    <button className="btn-action btn-green" onClick={() => setStatut(c.id, 'valide')}>Valider</button>
                  )}
                  {c.statut !== 'refuse' && (
                    <button className="btn-action btn-red" onClick={() => setStatut(c.id, 'refuse')}>Refuser</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
