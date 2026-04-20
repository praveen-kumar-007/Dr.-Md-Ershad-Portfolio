import { useEffect, useState } from 'react'
import { createHighlight, deleteHighlight, getHighlights, updateHighlight } from '../services/api'

const initialHighlight = {
  title: '',
  description: '',
  category: '',
  link: '',
}

function HighlightsAdmin() {
  const [highlights, setHighlights] = useState([])
  const [entry, setEntry] = useState(initialHighlight)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const data = await getHighlights()
        setHighlights(data)
      } catch (error) {
        console.error('Failed to load highlights', error)
      } finally {
        setLoading(false)
      }
    }

    loadHighlights()
  }, [])

  const handleChange = (field) => (event) => {
    setEntry({ ...entry, [field]: event.target.value })
  }

  const resetForm = () => {
    setEntry(initialHighlight)
    setEditingId(null)
  }

  const saveHighlight = async () => {
    if (!entry.title || !entry.description) {
      alert('Title and description are required')
      return
    }

    try {
      if (editingId) {
        const updated = await updateHighlight(editingId, entry)
        setHighlights(highlights.map((item) => (item._id === editingId ? updated : item)))
        resetForm()
      } else {
        const created = await createHighlight(entry)
        setHighlights([created, ...highlights])
        resetForm()
      }
    } catch (error) {
      alert(editingId ? 'Failed to update highlight' : 'Failed to save highlight')
      console.error(error)
    }
  }

  const editHighlight = (highlight) => {
    setEditingId(highlight._id)
    setEntry({
      title: highlight.title,
      description: highlight.description,
      category: highlight.category || '',
      link: highlight.link || '',
    })
  }

  const removeHighlight = async (id) => {
    try {
      await deleteHighlight(id)
      setHighlights(highlights.filter((item) => item._id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert('Failed to delete highlight')
      console.error(error)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Highlights</h1>
        <p>Update homepage research highlight cards and featured selected work.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Title</label>
          <input value={entry.title} onChange={handleChange('title')} placeholder="Highlight title" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={entry.description} onChange={handleChange('description')} placeholder="Short summary" />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input value={entry.category} onChange={handleChange('category')} placeholder="Optional category" />
        </div>
        <div className="form-group">
          <label>Link</label>
          <input value={entry.link} onChange={handleChange('link')} placeholder="Optional link" />
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={saveHighlight}>
            {editingId ? 'Update Highlight' : 'Add Highlight'}
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
          <p>Loading highlights...</p>
        ) : (
          highlights.map((highlight) => (
            <div key={highlight._id} className="admin-list-item publication-admin-item">
              <div>
                <h3>{highlight.title}</h3>
                {highlight.category ? <p>{highlight.category}</p> : null}
                {highlight.description ? <p>{highlight.description}</p> : null}
                {highlight.link ? (
                  <a href={highlight.link} target="_blank" rel="noreferrer">
                    View link
                  </a>
                ) : null}
              </div>
              <div className="admin-list-actions">
                <button type="button" className="admin-button" onClick={() => editHighlight(highlight)}>
                  Edit
                </button>
                <button type="button" className="admin-remove" onClick={() => removeHighlight(highlight._id)}>
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

export default HighlightsAdmin
