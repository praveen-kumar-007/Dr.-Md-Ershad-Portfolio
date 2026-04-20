const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    let error
    try {
      error = text ? JSON.parse(text) : { message: response.statusText }
    } catch {
      error = { message: text || response.statusText }
    }
    throw new Error(error.message || response.statusText || `HTTP ${response.status}`)
  }

  return response.json()
}

export function getPublications(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return request(`/publications${query}`)
}

export function createPublication(data) {
  return request('/publications', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deletePublication(id) {
  return request(`/publications/${id}`, { method: 'DELETE' })
}

export function updatePublication(id, data) {
  return request(`/publications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getGalleryItems() {
  return request('/gallery')
}

export function createGalleryItem(data) {
  return request('/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateGalleryItem(id, data) {
  return request(`/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteGalleryItem(id) {
  return request(`/gallery/${id}`, { method: 'DELETE' })
}

export function getContact() {
  return request('/contact')
}

export function createContact(data) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateContact(id, data) {
  return request(`/contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getExperiences() {
  return request('/experiences')
}

export function createExperience(data) {
  return request('/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateExperience(id, data) {
  return request(`/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getDegrees() {
  return request('/degrees')
}

export function createDegree(data) {
  return request('/degrees', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateDegree(id, data) {
  return request(`/degrees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteDegree(id) {
  return request(`/degrees/${id}`, { method: 'DELETE' })
}

export function getAchievements() {
  return request('/achievements')
}

export function createAchievement(data) {
  return request('/achievements', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateAchievement(id, data) {
  return request(`/achievements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteAchievement(id) {
  return request(`/achievements/${id}`, { method: 'DELETE' })
}

export function getHighlights() {
  return request('/highlights')
}

export function createHighlight(data) {
  return request('/highlights', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateHighlight(id, data) {
  return request(`/highlights/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteHighlight(id) {
  return request(`/highlights/${id}`, { method: 'DELETE' })
}

export function loginAdmin(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function deleteExperience(id) {
  return request(`/experiences/${id}`, { method: 'DELETE' })
}
