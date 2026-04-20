import { useEffect, useState } from 'react'
import { createExperience, deleteExperience, getExperiences, updateExperience } from '../services/api'

const initialEntry = {
  title: '',
  institution: '',
  role: '',
  category: 'Teaching',
  duration: '',
  location: '',
  description: '',
}

function ExperienceAdmin() {
  const [experiences, setExperiences] = useState([])
  const [entry, setEntry] = useState(initialEntry)
  const [logoFile, setLogoFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [existingLogoUrl, setExistingLogoUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await getExperiences()
        setExperiences(data)
      } catch (error) {
        console.error('Failed to load experiences', error)
      } finally {
        setLoading(false)
      }
    }

    loadExperiences()
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
    setEditingId(null)
    setExistingLogoUrl('')
    const input = document.getElementById('experience-logo-input')
    if (input) input.value = ''
  }

  const saveExperience = async () => {
    if (!entry.title || !entry.institution || !entry.role || !entry.duration) {
      alert('Title, institution, role, and duration are required')
      return
    }

    try {
      const payload = { ...entry }
      if (logoFile) {
        payload.logoUrl = await toDataUrl(logoFile)
      }

      if (editingId) {
        const updated = await updateExperience(editingId, payload)
        setExperiences(experiences.map((item) => (item._id === editingId ? updated : item)))
        resetForm()
      } else {
        const created = await createExperience(payload)
        setExperiences([created, ...experiences])
        resetForm()
      }
    } catch (error) {
      alert(editingId ? 'Failed to update experience' : 'Failed to add experience')
      console.error(error)
    }
  }

  const editExperience = (experience) => {
    setEditingId(experience._id)
    setEntry({
      title: experience.title,
      institution: experience.institution,
      role: experience.role,
      category: experience.category || 'Teaching',
      duration: experience.duration,
      location: experience.location || '',
      description: experience.description || '',
    })
    setExistingLogoUrl(experience.logoUrl || '')
    setLogoFile(null)
  }

  const removeExperience = async (id) => {
    try {
      await deleteExperience(id)
      setExperiences(experiences.filter((experience) => experience._id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert('Failed to remove experience')
      console.error(error)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Experience</h1>
        <p>Capture roles, institution logos, and academic assignments with an elegant admin form.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Role title</label>
          <input value={entry.title} onChange={handleChange('title')} placeholder="Assistant Professor" />
        </div>
        <div className="form-group">
          <label>Institution</label>
          <input value={entry.institution} onChange={handleChange('institution')} placeholder="University or college name" />
        </div>
        <div className="form-group">
          <label>Role type</label>
          <select value={entry.category} onChange={handleChange('category')}>
            <option value="Teaching">Teaching</option>
            <option value="Research">Research</option>
            <option value="Administration">Administration</option>
            <option value="Visiting">Visiting</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Duration</label>
          <input value={entry.duration} onChange={handleChange('duration')} placeholder="Sept 2022 – Present" />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input value={entry.location} onChange={handleChange('location')} placeholder="Kolkata, India" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={entry.description} onChange={handleChange('description')} placeholder="Brief role summary" />
        </div>
        <div className="form-group">
          <label>Logo or institution image</label>
          <input id="experience-logo-input" type="file" accept="image/*" onChange={handleLogoChange} />
          {existingLogoUrl && !logoFile ? (
            <img src={existingLogoUrl} alt="Current logo" className="admin-gallery-preview" />
          ) : null}
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={saveExperience}>
            {editingId ? 'Update Experience' : 'Add Experience'}
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
          <p>Loading experience entries...</p>
        ) : (
          experiences.map((experience) => (
            <div key={experience._id} className="admin-list-item publication-admin-item">
              <div>
                <h3>{experience.title}</h3>
                <p>{experience.institution} · {experience.duration}</p>
                <p className="muted-text">{experience.category}</p>
                {experience.location ? <p>{experience.location}</p> : null}
                {experience.description ? <p>{experience.description}</p> : null}
              </div>
              <div className="admin-list-actions">
                <button type="button" className="admin-button" onClick={() => editExperience(experience)}>
                  Edit
                </button>
                <button type="button" className="admin-remove" onClick={() => removeExperience(experience._id)}>
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

export default ExperienceAdmin
