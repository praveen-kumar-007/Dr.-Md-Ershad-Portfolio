import { useEffect, useState } from 'react'
import { createPublication, deletePublication, getPublications, updatePublication } from '../services/api'

const initialEntry = {
  title: '',
  publisher: '',
  year: '',
  publicationType: 'Publication',
  link: '',
  summary: '',
}

function PublicationsAdmin() {
  const [publications, setPublications] = useState([])
  const [entry, setEntry] = useState(initialEntry)
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await getPublications()
        setPublications(data)
      } catch (error) {
        console.error('Failed to load publications', error)
      } finally {
        setLoading(false)
      }
    }

    loadPublications()
  }, [])

  const handleChange = (field) => (event) => {
    setEntry({ ...entry, [field]: event.target.value })
  }

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0])
    }
  }

  const toDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const resetForm = () => {
    setEntry(initialEntry)
    setImageFile(null)
    setEditingId(null)
    const input = document.getElementById('publication-image-input')
    if (input) input.value = ''
  }

  const savePublication = async () => {
    if (!entry.title || !entry.publisher || !entry.year) {
      alert('Title, publisher, and year are required')
      return
    }

    try {
      const payload = { ...entry }
      if (imageFile) {
        payload.imageUrl = await toDataUrl(imageFile)
      }

      if (editingId) {
        const updated = await updatePublication(editingId, payload)
        setPublications(publications.map((item) => (item._id === editingId ? updated : item)))
        resetForm()
      } else {
        const created = await createPublication(payload)
        setPublications([...publications, created])
        resetForm()
      }
    } catch (error) {
      alert(editingId ? 'Failed to update publication' : 'Failed to add publication')
      console.error(error)
    }
  }

  const editPublication = (publication) => {
    setEditingId(publication._id)
    setEntry({
      title: publication.title,
      publisher: publication.publisher,
      year: publication.year,
      publicationType: publication.publicationType || 'Publication',
      link: publication.link || '',
      summary: publication.summary || '',
    })
    setImageFile(null)
  }

  const removePublication = async (id) => {
    try {
      await deletePublication(id)
      setPublications(publications.filter((publication) => publication._id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert('Failed to remove publication')
      console.error(error)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Publications</h1>
        <p>Keep research outputs updated and share your latest articles and patents.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Title</label>
          <input value={entry.title} onChange={handleChange('title')} placeholder="Publication title" />
        </div>
        <div className="form-group">
          <label>Publisher / Source</label>
          <input value={entry.publisher} onChange={handleChange('publisher')} placeholder="Journal, conference or publisher" />
        </div>
        <div className="form-group">
          <label>Publication type</label>
          <select value={entry.publicationType} onChange={handleChange('publicationType')}>
            <option value="Publication">Publication</option>
            <option value="Article">Article</option>
            <option value="Patent">Patent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Year</label>
          <input value={entry.year} onChange={handleChange('year')} placeholder="2024" />
        </div>
        <div className="form-group">
          <label>Link</label>
          <input value={entry.link} onChange={handleChange('link')} placeholder="Article or patent URL" />
        </div>
        <div className="form-group">
          <label>Summary</label>
          <textarea value={entry.summary} onChange={handleChange('summary')} placeholder="Short overview" />
        </div>
        <div className="form-group">
          <label>Image for this item</label>
          <input id="publication-image-input" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={savePublication}>
            {editingId ? 'Update Publication' : 'Add Publication'}
          </button>
          {editingId ? (
            <button type="button" className="admin-remove" onClick={resetForm}>
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      <div className="admin-list-panel">
        {loading ? (
          <p>Loading publications...</p>
        ) : (
          publications.map((publication) => (
            <div key={publication._id} className="admin-list-item publication-admin-item">
              <div>
                <h3>{publication.title}</h3>
                <p>{publication.publisher} · {publication.year}</p>
                <span className="tag-pill">{publication.publicationType || 'Publication'}</span>
                {publication.link ? (
                  <a href={publication.link} target="_blank" rel="noreferrer">
                    Open link
                  </a>
                ) : null}
                {publication.summary ? <p>{publication.summary}</p> : null}
              </div>
              <div className="admin-list-actions">
                <button type="button" className="admin-button" onClick={() => editPublication(publication)}>
                  Edit
                </button>
                <button type="button" className="admin-remove" onClick={() => removePublication(publication._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PublicationsAdmin
