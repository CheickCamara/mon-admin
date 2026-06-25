const BASE = 'https://mon-api-rqm7.onrender.com'

// Sauvegarde et lecture du token dans le navigateur
export const saveToken = (token: string) => localStorage.setItem('admin_token', token)
export const getToken = () => localStorage.getItem('admin_token')
export const clearToken = () => localStorage.removeItem('admin_token')

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export async function login(password: string): Promise<boolean> {
  const r = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!r.ok) return false
  const { token } = await r.json()
  saveToken(token)
  return true
}

export async function getStats() {
  const r = await fetch(`${BASE}/admin/stats`, { headers: headers() })
  if (r.status === 401) { clearToken(); window.location.reload(); return null }
  return r.json()
}

export async function getInfluenceurs() {
  const r = await fetch(`${BASE}/admin/influenceurs`, { headers: headers() })
  return r.json()
}

export async function updateInfluenceur(id: number, statut: string) {
  await fetch(`${BASE}/admin/influenceurs/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify({ statut }),
  })
}

export async function getCandidatures() {
  const r = await fetch(`${BASE}/admin/candidatures`, { headers: headers() })
  return r.json()
}

export async function updateCandidature(id: number, data: { statut?: string; post_publie?: boolean }) {
  await fetch(`${BASE}/admin/candidatures/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  })
}

export async function getRestaurants() {
  const r = await fetch(`${BASE}/restaurants`, { headers: headers() })
  return r.json()
}

export async function addRestaurant(data: object) {
  const r = await fetch(`${BASE}/admin/restaurants`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  })
  return r.json()
}

export async function updateRestaurant(id: number, data: object) {
  await fetch(`${BASE}/admin/restaurants/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  })
}

export async function deleteRestaurant(id: number) {
  await fetch(`${BASE}/admin/restaurants/${id}`, {
    method: 'DELETE', headers: headers(),
  })
}

export async function getOffres() {
  const r = await fetch(`${BASE}/admin/offres`, { headers: headers() })
  return r.json()
}

export async function addOffre(data: object) {
  const r = await fetch(`${BASE}/admin/offres`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  })
  return r.json()
}

export async function updateOffre(id: number, data: object) {
  await fetch(`${BASE}/admin/offres/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  })
}

export async function deleteOffre(id: number) {
  await fetch(`${BASE}/admin/offres/${id}`, {
    method: 'DELETE', headers: headers(),
  })
}
