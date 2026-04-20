import { useEffect, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PlaceholderMedia from '../components/PlaceholderMedia'
import '../styles/components.css'
import { getAchievements } from '../services/api'

function Achievements() {
  const [achievements, setAchievements] = useState([])
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

  return (
    <main className="page-content">
      <SectionHeading title="Achievements & Awards" eyebrow="Awards and recognition" />
      <section className="panel highlight-panel">
        <p>All awards, recognitions, reviewer roles and academic distinctions are managed through the admin console.</p>
      </section>
      {loading ? (
        <section className="panel">
          <p>Loading achievements...</p>
        </section>
      ) : (
        <section className="panel">
          <div className="bullet-list">
            {achievements.length > 0 ? (
              achievements.map((item) => (
                <div key={item._id} className="achievement-item">
                  <PlaceholderMedia
                    src={item.imageUrl}
                    alt={item.title}
                    label={item.title || item.organization}
                    wrapperClass="achievement-avatar"
                    imageClass="achievement-avatar-image"
                  />
                  <div className="achievement-item-content">
                    <h3>{item.title}</h3>
                    {item.organization ? <p className="muted-text">{item.organization}</p> : null}
                    {item.year ? <p className="muted-text">{item.year}</p> : null}
                    {item.description ? <p>{item.description}</p> : null}
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer" className="button-primary">
                        View details
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p>No achievements are available yet.</p>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default Achievements
