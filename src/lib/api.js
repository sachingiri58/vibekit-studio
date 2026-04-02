// src/lib/api.js
// Centralised API client — all fetch calls go through here

const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

// Auth
export const auth = {
  signup: (body) => request('/auth-signup', { method: 'POST', body }),
  login: (body) => request('/auth-login', { method: 'POST', body }),
  logout: () => request('/auth-logout', { method: 'POST' })
}

// Pages (authenticated)
export const pages = {
  list: () => request('/pages'),
  create: (body) => request('/pages', { method: 'POST', body }),
  get: (id) => request(`/page-by-id/${id}`),
  update: (id, body) => request(`/page-by-id/${id}`, { method: 'PUT', body }),
  publish: (id) => request(`/page-by-id/${id}/publish`, { method: 'POST' }),
  unpublish: (id) => request(`/page-by-id/${id}/unpublish`, { method: 'POST' }),
  duplicate: (id) => request(`/page-by-id/${id}/duplicate`, { method: 'POST' })
}

// Public (no auth needed)
export const publicApi = {
  getPage: (slug) => request(`/public-page/${slug}`),
  trackView: (slug) => request(`/public-page/${slug}/view`, { method: 'POST' }),
  contact: (slug, body) => request(`/public-page/${slug}/contact`, { method: 'POST', body })
}
