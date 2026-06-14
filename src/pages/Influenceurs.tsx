import { useEffect, useState } from 'react'
import { getInfluenceurs, updateInfluenceur } from '../api'

type Influenceur = {
  id: number
  nom: string
  email: string
  reseau: string
  abonnes: number
  statut: string
  date_inscription: string
}

const STATUT_LABEL: Record<string, string> = {
  en_attente: '⏳ En attente',
  valide: '✅ Validé',
  refuse: '❌ Refusé',
}

export default function Influenceurs() {
  const [liste, setListe] = useState<Influenceur[]>([])
  const [filtre, setFiltre] = useState('tous')

  const load = () => getInfluenceurs().then(setListe)
  useEffect(() => { load() }, [])

  const action = async (id: number, statut: string) => {
    await updateInfluenceur(id, statut)
    load()
  }

  const affichés = filtre === 'tous' ? liste : liste.filter(i => i.statut === filtre)

  return (
    <div className="page">
      <h1 className="page-title">Influenceurs</h1>

      <div className="filters">
        {['tous', 'en_attente', 'valide', 'refuse'].map(f => (
          <button key={f} className={`filter-btn ${filtre === f ? 'active' : ''}`} onClick={() => setFiltre(f)}>
            {f === 'tous' ? 'Tous' : STATUT_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Réseau</th>
              <th>Abonnés</th>
              <th>Statut</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {affichés.length === 0 && (
              <tr><td colSpan={7} className="empty">Aucun résultat.</td></tr>
            )}
            {affichés.map(i => (
              <tr key={i.id}>
                <td><strong>{i.nom}</strong></td>
                <td>{i.email}</td>
                <td><span className="tag">{i.reseau}</span></td>
                <td>{i.abonnes.toLocaleString('fr-FR')}</td>
                <td><span className={`badge badge-${i.statut}`}>{STATUT_LABEL[i.statut]}</span></td>
                <td>{new Date(i.date_inscription).toLocaleDateString('fr-FR')}</td>
                <td className="actions">
                  {i.statut !== 'valide' && (
                    <button className="btn-action btn-green" onClick={() => action(i.id, 'valide')}>Valider</button>
                  )}
                  {i.statut !== 'refuse' && (
                    <button className="btn-action btn-red" onClick={() => action(i.id, 'refuse')}>Refuser</button>
                  )}
                  {i.statut !== 'en_attente' && (
                    <button className="btn-action btn-gray" onClick={() => action(i.id, 'en_attente')}>Remettre en attente</button>
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
