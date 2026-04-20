import { useEffect, useState } from 'react'
import { createDegree, deleteDegree, getDegrees, updateDegree } from '../services/api'

const initialEntry = {
  degree: '',
  institution: '',
  year: '',
  score: '',
  description: '',
  logoLabel: '',
}

function DegreeAdmin() {
  const [degrees, setDegrees] = useState([])
  const [entry, setEntry] = useState(initialEntry)
  const [logoFile, setLogoFile] = useState(null)
  const [existingLogoUrl, setExistingLogoUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDegrees = async () => {
      try {
        const data = await getDegrees()
        setDegrees(data)
      } catch (error) {
        console.error('Failed to load academic qualifications', error)
      } finally {
        setLoading(false)
      }
    }

    loadDegrees()
  }, [])

  const handleChange = (field) => (event) => {
    setEntry({ ...entry, [field]: event.target.value })
  }

  const handleLogoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0])
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
    setLogoFile(null)
    setExistingLogoUrl('')
    setEditingId(null)
    const input = document.getElementById('degree-logo-input')
    if (input) input.value = ''
  }

  const saveDegree = async () => {
    if (!entry.degree || !entry.institution) {
      alert('Degree title and institution are required')
      return
    }

    try {
      const payload = { ...entry }
      if (logoFile) {
        payload.logoUrl = await toDataUrl(logoFile)
      }

      if (editingId) {
        const updated = await updateDegree(editingId, payload)
        setDegrees(degrees.map((item) => (item._id === editingId ? updated : item)))
        resetForm()
      } else {
        const created = await createDegree(payload)
        setDegrees([...degrees, created])
        resetForm()
      }
    } catch (error) {
      alert(editingId ? 'Failed to update academic qualification' : 'Failed to add qualification')
      console.error(error)
    }
  }

  const editDegree = (degree) => {
    setEditingId(degree._id)
    setEntry({
      degree: degree.degree,
      institution: degree.institution,
      year: degree.year || '',
      score: degree.score || '',
      description: degree.description || '',
      logoLabel: degree.logoLabel || '',
    })
    setExistingLogoUrl(degree.logoUrl || '')
    setLogoFile(null)
  }

  const removeDegree = async (id) => {
    try {
      await deleteDegree(id)
      setDegrees(degrees.filter((degree) => degree._id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert('Failed to remove academic qualification')
      console.error(error)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Academics</h1>
        <p>Manage degrees, certifications, and institution logos directly from the database.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Degree / Certification</label>
          <input value={entry.degree} onChange={handleChange('degree')} placeholder="Ph.D. in Advance Materials" />
        </div>
        <div className="form-group">
          <label>Institution</label>
          <input value={entry.institution} onChange={handleChange('institution')} placeholder="IIT (BHU), Varanasi" />
        </div>
        <div className="form-group">
          <label>Year</label>
          <input value={entry.year} onChange={handleChange('year')} placeholder="2018" />
        </div>
        <div className="form-group">
          <label>Score / Grade</label>
          <input value={entry.score} onChange={handleChange('score')} placeholder="CGPA 9.2/10" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={entry.description} onChange={handleChange('description')} placeholder="Research focus, thesis or specialization" />
        </div>
        <div className="form-group">
          <label>Logo label</label>
          <input value={entry.logoLabel} onChange={handleChange('logoLabel')} placeholder="University logo label" />
        </div>
        <div className="form-group">
          <label>Institution logo</label>
          <input id="degree-logo-input" type="file" accept="image/*" onChange={handleLogoChange} />
          {existingLogoUrl && !logoFile ? (
            <img src={existingLogoUrl} alt="Existing logo" className="admin-gallery-preview" />
          ) : null}
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={saveDegree}>
            {editingId ? 'Update Qualification' : 'Add Qualification'}
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
          <p>Loading academic qualifications...</p>
        ) : (
          degrees.map((degree) => (
            <div key={degree._id} className="admin-list-item publication-admin-item">
              <div>
                <h3>{degree.degree}</h3>
                <p>{degree.institution} · {degree.year || 'Year not specified'}</p>
                {degree.score ? <p>{degree.score}</p> : null}
                {degree.description ? <p>{degree.description}</p> : null}
                {degree.logoLabel ? <p className="muted-text">{degree.logoLabel}</p> : null}
                {degree.logoUrl ? (
                  <img src={degree.logoUrl} alt={degree.logoLabel || degree.institution} className="admin-gallery-preview" />
                ) : null}
              </div>
              <div className="admin-list-actions">
                <button type="button" className="admin-button" onClick={() => editDegree(degree)}>
                  Edit
                </button>
                <button type="button" className="admin-remove" onClick={() => removeDegree(degree._id)}>
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

export default DegreeAdmin
