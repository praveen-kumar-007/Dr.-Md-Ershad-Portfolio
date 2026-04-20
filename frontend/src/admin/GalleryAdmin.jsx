import { useEffect, useState } from 'react'
import { createGalleryItem, deleteGalleryItem, getGalleryItems, updateGalleryItem } from '../services/api'

const initialEntry = {
  title: '',
  description: '',
}

function GalleryAdmin() {
  const [items, setItems] = useState([])
  const [entry, setEntry] = useState(initialEntry)
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getGalleryItems()
        setItems(data)
      } catch (error) {
        console.error('Failed to load gallery items', error)
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
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
    setExistingImageUrl('')
    const input = document.getElementById('gallery-image-input')
    if (input) input.value = ''
  }

  const saveItem = async () => {
    if (!entry.title || !entry.description) {
      alert('Title and description are required')
      return
    }

    try {
      const payload = { ...entry }
      if (imageFile) {
        payload.imageUrl = await toDataUrl(imageFile)
      }

      if (editingId) {
        const updated = await updateGalleryItem(editingId, payload)
        setItems(items.map((item) => (item._id === editingId ? updated : item)))
        resetForm()
      } else {
        const created = await createGalleryItem(payload)
        setItems([...items, created])
        resetForm()
      }
    } catch (error) {
      alert(editingId ? 'Failed to update gallery item' : 'Failed to add gallery item')
      console.error(error)
    }
  }

  const editItem = (item) => {
    setEditingId(item._id)
    setEntry({ title: item.title, description: item.description })
    setExistingImageUrl(item.imageUrl || '')
    setImageFile(null)
  }

  const removeItem = async (id) => {
    try {
      await deleteGalleryItem(id)
      setItems(items.filter((item) => item._id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert('Failed to remove gallery item')
      console.error(error)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Gallery</h1>
        <p>Update gallery highlights and keep the site visuals aligned with current activities.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Title</label>
          <input value={entry.title} onChange={handleChange('title')} placeholder="Gallery item title" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={entry.description} onChange={handleChange('description')} placeholder="Short description" />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input id="gallery-image-input" type="file" accept="image/*" onChange={handleFileChange} />
          {existingImageUrl && !imageFile ? (
            <img src={existingImageUrl} alt="Existing image preview" className="admin-gallery-preview" />
          ) : null}
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={saveItem}>
            {editingId ? 'Update Gallery Item' : 'Add Gallery Item'}
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
          <p>Loading gallery items...</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="admin-list-item publication-admin-item">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="admin-gallery-preview" />
                ) : null}
              </div>
              <div className="admin-list-actions">
                <button type="button" className="admin-button" onClick={() => editItem(item)}>
                  Edit
                </button>
                <button type="button" className="admin-remove" onClick={() => removeItem(item._id)}>
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

export default GalleryAdmin
