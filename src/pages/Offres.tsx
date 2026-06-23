import { useEffect, useState } from 'react'
import { getOffres, getRestaurants, addOffre, updateOffre, deleteOffre } from '../api'

type Offre = {
  id: number
  restaurant_id: number
  titre: string
  description: string
  menu: string
  valeur_indicative: number
  contrepartie: string
  nombre_places: number
  places_restantes: number
  tranche_min: number
  tranche_max: number | null
  statut: string
  conditions: string
  restaurants: { nom: string }
}

type Restaurant = { id: number; nom: string }

const EMPTY = {
  restaurant_id: '',
  titre: '',
  description: '',
  menu: '',
  valeur_indicative: '',
  contrepartie: 'post',
  nombre_places: '1',
  tranche_min: '1000',
  tranche_max: '',
  conditions: '',
}

const CONTREPARTIE_LABEL: Record<string, string> = {
  story: '📱 Story',
  post: '📸 Post',
  reel: '🎬 Reel / Vidéo',
}

const STATUT_LABEL: Record<string, string> = {
  active: '✅ Active',
  en_pause: '⏸ En pause',
  cloturee: '🔒 Clôturée',
}

export default function Offres() {
  const [offres, setOffres] = useState<Offre[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    getOffres().then(setOffres)
    getRestaurants().then(setRestaurants)
  }
  useEffect(() => { load() }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true) }
  const openEdit = (o: Offre) => {
    setForm({
      restaurant_id: String(o.restaurant_id),
      titre: o.titre,
      description: o.description || '',
      menu: o.menu || '',
      valeur_indicative: String(o.valeur_indicative || ''),
      contrepartie: o.contrepartie,
      nombre_places: String(o.nombre_places),
      tranche_min: String(o.tranche_min),
      tranche_max: o.tranche_max ? String(o.tranche_max) : '',
      conditions: o.conditions || '',
    })
    setEditing(o.id)
    setShowForm(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      restaurant_id: Number(form.restaurant_id),
      valeur_indicative: Number(form.valeur_indicative) || null,
      nombre_places: Number(form.nombre_places),
      tranche_min: Number(form.tranche_min),
      tranche_max: form.tranche_max ? Number(form.tranche_max) : null,
    }
    if (editing !== null) await updateOffre(editing, payload)
    else await addOffre(payload)
    setShowForm(false)
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette offre ?')) return
    await deleteOffre(id)
    load()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Offres</h1>
        <button className="btn-primary" onClick={openAdd}>+ Nouvelle offre</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editing !== null ? 'Modifier l\'offre' : 'Nouvelle offre'}</h2>
            <form className="form" onSubmit={submit}>
              <label>Restaurant
                <select value={form.restaurant_id} onChange={set('restaurant_id')} required>
                  <option value="">Choisir un restaurant…</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.nom}</option>
                  ))}
                </select>
              </label>
              <label>Titre de l'offre
                <input value={form.titre} onChange={set('titre')} placeholder="Ex: Menu dégustation automne" required />
              </label>
              <label>Description
                <textarea value={form.description} onChange={set('description')} placeholder="Description de l'expérience…" />
              </label>
              <label>Menu inclus
                <textarea value={form.menu} onChange={set('menu')} placeholder="Entrée + plat + dessert + boisson…" />
              </label>
              <label>Valeur indicative (€)
                <input type="number" value={form.valeur_indicative} onChange={set('valeur_indicative')} placeholder="65" />
              </label>
              <label>Contrepartie attendue
                <select value={form.contrepartie} onChange={set('contrepartie')} required>
                  <option value="story">📱 Story</option>
                  <option value="post">📸 Post (photo)</option>
                  <option value="reel">🎬 Reel / Vidéo TikTok</option>
                </select>
              </label>
              <label>Nombre de places
                <input type="number" value={form.nombre_places} onChange={set('nombre_places')} min="1" required />
              </label>
              <label>Abonnés minimum
                <input type="number" value={form.tranche_min} onChange={set('tranche_min')} min="1000" required />
              </label>
              <label>Abonnés maximum (optionnel)
                <input type="number" value={form.tranche_max} onChange={set('tranche_max')} placeholder="Laisser vide = pas de limite" />
              </label>
              <label>Conditions particulières
                <textarea value={form.conditions} onChange={set('conditions')} placeholder="Ex: Hors week-end, midi uniquement…" />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn-primary">{editing !== null ? 'Enregistrer' : 'Créer l\'offre'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Restaurant</th>
              <th>Contrepartie</th>
              <th>Places</th>
              <th>Abonnés requis</th>
              <th>Valeur</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offres.length === 0 && (
              <tr><td colSpan={8} className="empty">Aucune offre.</td></tr>
            )}
            {offres.map(o => (
              <tr key={o.id}>
                <td><strong>{o.titre}</strong></td>
                <td>{o.restaurants?.nom}</td>
                <td><span className="tag">{CONTREPARTIE_LABEL[o.contrepartie]}</span></td>
                <td>{o.places_restantes} / {o.nombre_places}</td>
                <td>
                  {o.tranche_min.toLocaleString('fr-FR')}
                  {o.tranche_max ? ` – ${o.tranche_max.toLocaleString('fr-FR')}` : '+'}
                </td>
                <td>{o.valeur_indicative ? `${o.valeur_indicative} €` : '—'}</td>
                <td><span className={`badge badge-${o.statut === 'active' ? 'valide' : 'en_attente'}`}>{STATUT_LABEL[o.statut]}</span></td>
                <td className="actions">
                  <button className="btn-action btn-gray" onClick={() => openEdit(o)}>Modifier</button>
                  <button className="btn-action btn-red" onClick={() => remove(o.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
