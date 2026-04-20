import { useEffect, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import TimelineItem from '../components/TimelineItem'
import PlaceholderMedia from '../components/PlaceholderMedia'
import '../styles/components.css'
import { getDegrees, getExperiences } from '../services/api'

const courses = [
  'Theory of Machines',
  'Engineering Graphics & Design',
  'Operation Research',
  'Materials Science & Technology',
  'Internal Combustion Engines',
]

const highlights = [
  'Delivered practical lab sessions to bridge theory and hands-on engineering design.',
  'Guided student research in additive manufacturing and sustainable materials.',
  'Developed curriculum frameworks for IC engines and materials technology.',
  'Collaborated with industry-focused projects and student innovation competitions.',
]

function Experience() {
  const [experienceItems, setExperienceItems] = useState([])
  const [degrees, setDegrees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const items = await getExperiences()
        setExperienceItems(items)
      } catch (error) {
        console.error('Failed to load experience entries', error)
      }

      try {
        const degreesData = await getDegrees()
        setDegrees(degreesData)
      } catch (error) {
        console.error('Failed to load academic qualifications', error)
      } finally {
        setLoading(false)
      }
    }

    loadExperience()
  }, [])

  return (
    <main className="page-content">
      <SectionHeading title="Experience & Education" eyebrow="Academic profile" />

      <section className="split-grid">
        <div className="panel">
          <SectionHeading title="Professional Experience" />
          {loading ? (
            <p>Loading experience entries...</p>
          ) : experienceItems.length === 0 ? (
            <p>No experience entries found yet.</p>
          ) : (
            <div className="experience-grid">
              {experienceItems.map((item) => (
                <article key={item._id} className="experience-card">
                  <PlaceholderMedia
                    src={item.logoUrl}
                    alt={item.institution}
                    label={item.institution || item.title}
                    wrapperClass="experience-logo-wrap"
                    imageClass="experience-logo"
                  />
                  <div className="experience-content">
                    <h3>{item.title}</h3>
                    <p className="publication-meta">{item.institution} · {item.duration}</p>
                    <p className="tag-pill">{item.category}</p>
                    {item.location ? <p>{item.location}</p> : null}
                    {item.description ? <p>{item.description}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <SectionHeading title="Academic Qualifications" />
          <div className="timeline-list">
            {degrees.length > 0 ? (
              degrees.map((item) => (
                <TimelineItem
                  key={item._id}
                  title={item.degree}
                  organization={item.institution}
                  duration={item.year || 'Year not specified'}
                  description={item.description || item.score || 'Academic qualification details'}
                />
              ))
            ) : (
              <p>Academic qualifications are managed through the database.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section expertise-panel">
        <div className="panel">
          <SectionHeading title="Core Courses" eyebrow="Key subjects" />
          <div className="course-list">
            {courses.map((course) => (
              <span key={course} className="course-pill">{course}</span>
            ))}
          </div>
        </div>

        <div className="panel">
          <SectionHeading title="Teaching highlights" eyebrow="Academic impact" />
          <ul className="bullet-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Experience
