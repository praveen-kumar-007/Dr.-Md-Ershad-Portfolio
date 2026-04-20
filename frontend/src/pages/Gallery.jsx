import { useEffect, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PlaceholderMedia from '../components/PlaceholderMedia'
import { SkeletonCard } from '../components/SkeletonBlock'
import '../styles/components.css'
import { getGalleryItems } from '../services/api'

function Gallery() {
  const [items, setItems] = useState([])
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

  return (
    <main className="page-content">
      <SectionHeading title="Gallery" eyebrow="Highlights" />
      <p className="page-intro-text">
        A visual overview of teaching, research and academic leadership. Each highlight reflects practical experience and research impact.
      </p>
      <div className="feature-grid gallery-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} className="gallery-card" />
          ))
        ) : (
          items.map((item) => (
            <article key={item._id} className="feature-card gallery-card">
              <div className="gallery-card-badge">{item.title}</div>
              <PlaceholderMedia
                src={item.imageUrl}
                alt={item.title}
                label={item.title}
                wrapperClass="gallery-image-wrap"
                imageClass="gallery-image"
              />
              <p>{item.description}</p>
            </article>
          ))
        )}
      </div>
    </main>
  )
}

export default Gallery
