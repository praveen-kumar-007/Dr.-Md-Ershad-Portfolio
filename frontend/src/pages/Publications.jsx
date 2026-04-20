import { useEffect, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PlaceholderMedia from '../components/PlaceholderMedia'
import '../styles/components.css'
import { getPublications } from '../services/api'

function Publications() {
  const [publications, setPublications] = useState([])
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

  const grouped = publications.reduce((acc, item) => {
    const type = item.publicationType || 'Publication'
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {})

  const categories = [
    { key: 'Publication', title: 'Research Publications', description: 'Peer-reviewed journal and conference work.' },
    { key: 'Article', title: 'Academic Articles', description: 'Technical articles, educational reports, and thought leadership.' },
    { key: 'Patent', title: 'Patents', description: 'Filed patents, applied inventions and innovation records.' },
  ]

  return (
    <main className="page-content">
      <SectionHeading title="Publications, Articles & Patents" eyebrow="Research output" />

      <section className="panel highlight-panel">
        <p>
          A strong portfolio of publications, articles and patents highlights teaching excellence,
          materials research, and applied engineering innovation.
        </p>
      </section>

      {loading ? (
        <section className="panel">
          <p>Loading publications...</p>
        </section>
      ) : (
        categories.map((category) => (
          <section key={category.key} className="panel publication-group">
            <SectionHeading title={category.title} eyebrow={category.description} />
            {grouped[category.key] && grouped[category.key].length > 0 ? (
              <div className="publication-grid">
                {grouped[category.key].map((item) => (
                  <article key={item._id} className="publication-card">
                    <PlaceholderMedia
                      src={item.imageUrl}
                      alt={item.title}
                      label={item.title || item.publisher}
                      wrapperClass="publication-image-wrap"
                      imageClass="publication-image"
                    />
                    <div className="publication-content">
                      <h3>{item.title}</h3>
                      <p className="publication-meta">{item.publisher} · {item.year}</p>
                      {item.summary ? <p>{item.summary}</p> : null}
                      <div className="publication-actions">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noreferrer" className="button-primary">
                            View item
                          </a>
                        ) : null}
                        <span className="tag-pill">{item.publicationType || 'Publication'}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>No {category.title.toLowerCase()} found.</p>
            )}
          </section>
        ))
      )}
    </main>
  )
}

export default Publications
