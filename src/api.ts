const BASE = 'http://localhost:3001'
const PWD = 'popfluence2026'

const headers = () => ({
  'Content-Type': 'application/json',
  'x-admin-password': PWD,
})

export async function getStats() {
  const r = await fetch(`${BASE}/admin/stats`, { headers: headers() })
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

export async function login(password: string): Promise<boolean> {
  const r = await fetch(`${BASE}/admin/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return r.ok
}
