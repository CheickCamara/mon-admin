import { useEffect, useState } from 'react'
import { getRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../api'

type Restaurant = {
  id: number
  nom: string
  adresse: string
  description: string
  telephone: string
  statut: string
  info: string
}

const EMPTY = { nom: '', adresse: '', description: '', telephone: '', statut: 'Ouvert', info: '' }

export default function Restaurants() {
  const [liste, setListe] = useState<Restaurant[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => getRestaurants().then(setListe)
  useEffect(() => { load() }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (r: Restaurant) => {
    setForm({ nom: r.nom, adresse: r.adresse, description: r.description, telephone: r.telephone, statut: r.statut, info: r.info })
    setEditing(r.id)
    setShowForm(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing !== null) await updateRestaurant(editing, form)
    else await addRestaurant(form)
    setShowForm(false)
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce restaurant ?')) return
    await deleteRestaurant(id)
    load()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Restaurants</h1>
        <button className="btn-primary" onClick={openAdd}>+ Ajouter un restaurant</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing !== null ? 'Modifier le restaurant' : 'Nouveau restaurant'}</h2>
            <form className="form" onSubmit={submit}>
              <label>Nom <input value={form.nom} onChange={set('nom')} required /></label>
              <label>Adresse <input value={form.adresse} onChange={set('adresse')} required /></label>
              <label>Description <input value={form.description} onChange={set('description')} /></label>
              <label>Téléphone <input value={form.telephone} onChange={set('telephone')} /></label>
              <label>Statut
                <select value={form.statut} onChange={set('statut')}>
                  <option>Ouvert</option>
                  <option>Complet</option>
                  <option>Pause</option>
                  <option>Fermé</option>
                </select>
              </label>
              <label>Info <textarea value={form.info} onChange={set('info')} /></label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn-primary">{editing !== null ? 'Enregistrer' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Description</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {liste.length === 0 && (
              <tr><td colSpan={6} className="empty">Aucun restaurant.</td></tr>
            )}
            {liste.map(r => (
              <tr key={r.id}>
                <td><strong>{r.nom}</strong></td>
                <td>{r.adresse}</td>
                <td>{r.description}</td>
                <td>{r.telephone}</td>
                <td><span className={`badge badge-${r.statut === 'Ouvert' ? 'valide' : 'refuse'}`}>{r.statut}</span></td>
                <td className="actions">
                  <button className="btn-action btn-gray" onClick={() => openEdit(r)}>Modifier</button>
                  <button className="btn-action btn-red" onClick={() => remove(r.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
