import { useEffect, useState } from 'react'
import { createAchievement, deleteAchievement, getAchievements, updateAchievement } from '../services/api'

const initialAchievement = {
  title: '',
  description: '',
  organization: '',
  year: '',
  link: '',
}

function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([])
  const [entry, setEntry] = useState(initialAchievement)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await getAchievements()
        setAchievements(data)
      } catch (error) {
        console.error('Failed to load achievements', error)
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [])

  const handleChange = (field) => (event) => {
    setEntry({ ...entry, [field]: event.target.value })
  }

  const resetForm = () => {
    setEntry(initialAchievement)
    setEditingId(null)
  }

  const saveAchievement = async () => {
    if (!entry.title) {
      alert('Achievement title is required')
      return
    }

    try {
      if (editingId) {
        const updated = await updateAchievement(editingId, entry)
        setAchievements(achievements.map((item) => (item._id === editingId ? updated : item)))
        resetForm()
      } else {
        const created = await createAchievement(entry)
        setAchievements([created, ...achievements])
        resetForm()
      }
    } catch (error) {
      alert(editingId ? 'Failed to update achievement' : 'Failed to save achievement')
      console.error(error)
    }
  }

  const editAchievement = (achievement) => {
    setEditingId(achievement._id)
    setEntry({
      title: achievement.title,
      description: achievement.description || '',
      organization: achievement.organization || '',
      year: achievement.year || '',
      link: achievement.link || '',
    })
  }

  const removeAchievement = async (id) => {
    try {
      await deleteAchievement(id)
      setAchievements(achievements.filter((item) => item._id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert('Failed to delete achievement')
      console.error(error)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Achievements</h1>
        <p>Update awards, recognitions and latest academic achievements shown on the homepage.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Title</label>
          <input value={entry.title} onChange={handleChange('title')} placeholder="Award or recognition title" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={entry.description} onChange={handleChange('description')} placeholder="Short description" />
        </div>
        <div className="form-group">
          <label>Organization</label>
          <input value={entry.organization} onChange={handleChange('organization')} placeholder="Issuing organization" />
        </div>
        <div className="form-group">
          <label>Year</label>
          <input value={entry.year} onChange={handleChange('year')} placeholder="Year" />
        </div>
        <div className="form-group">
          <label>Link</label>
          <input value={entry.link} onChange={handleChange('link')} placeholder="Optional link to certificate or details" />
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={saveAchievement}>
            {editingId ? 'Update Achievement' : 'Add Achievement'}
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
          <p>Loading achievements...</p>
        ) : (
          achievements.map((achievement) => (
            <div key={achievement._id} className="admin-list-item publication-admin-item">
              <div>
                <h3>{achievement.title}</h3>
                {achievement.organization ? <p>{achievement.organization}</p> : null}
                {achievement.year ? <p>{achievement.year}</p> : null}
                {achievement.description ? <p>{achievement.description}</p> : null}
                {achievement.link ? (
                  <a href={achievement.link} target="_blank" rel="noreferrer">
                    View details
                  </a>
                ) : null}
              </div>
              <div className="admin-list-actions">
                <button type="button" className="admin-button" onClick={() => editAchievement(achievement)}>
                  Edit
                </button>
                <button type="button" className="admin-remove" onClick={() => removeAchievement(achievement._id)}>
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

export default AchievementsAdmin
