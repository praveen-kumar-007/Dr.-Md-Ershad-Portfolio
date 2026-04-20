import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import StatBadge from '../components/StatBadge'
import TimelineItem from '../components/TimelineItem'
import DownloadButton from '../components/DownloadButton'
import '../styles/components.css'
import '../styles/home.css'
import { getContact, getDegrees, getExperiences, getPublications, getGalleryItems, getAchievements } from '../services/api'
import PlaceholderMedia from '../components/PlaceholderMedia'

function Home() {
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    scholarUrl: '',
    profileImageUrl: '',
    googleScholar: '',
    googleScholarDetail: '',
    scopus: '',
    scopusDetail: '',
    academicExperience: '',
    academicExperienceDetail: '',
    researchFocus: '',
    researchFocusDetail: '',
  })

  const stats = [
    {
      label: 'Google Scholar',
      value: contact.googleScholar || 'No data',
      detail: contact.googleScholarDetail || 'Add this in admin',
    },
    {
      label: 'Scopus',
      value: contact.scopus || 'No data',
      detail: contact.scopusDetail || 'Add this in admin',
    },
    {
      label: 'Academic Experience',
      value: contact.academicExperience || 'No data',
      detail: contact.academicExperienceDetail || 'Add this in admin',
    },
    {
      label: 'Research Focus',
      value: contact.researchFocus || 'No data',
      detail: contact.researchFocusDetail || 'Add this in admin',
    },
  ]

  const [publicationCount, setPublicationCount] = useState(0)
  const [galleryCount, setGalleryCount] = useState(0)
  const [galleryItems, setGalleryItems] = useState([])
  const [degrees, setDegrees] = useState([])
  const [experienceItems, setExperienceItems] = useState([])
  const [achievements, setAchievements] = useState([])
  const [latestPublications, setLatestPublications] = useState([])
  const [latestArticles, setLatestArticles] = useState([])
  const [latestPatents, setLatestPatents] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const contactData = await getContact()
        setContact(contactData)
      } catch (error) {
        console.warn('Contact API unavailable', error)
      }

      try {
        const publications = await getPublications()
        setPublicationCount(publications.length)
        setLatestPublications(
          publications.filter((item) => (item.publicationType || 'Publication') === 'Publication').slice(0, 2),
        )
        setLatestArticles(publications.filter((item) => item.publicationType === 'Article').slice(0, 2))
        setLatestPatents(publications.filter((item) => item.publicationType === 'Patent').slice(0, 2))
      } catch (error) {
        console.warn('Publications API unavailable', error)
      }

      try {
        const gallery = await getGalleryItems()
        setGalleryCount(gallery.length)
        setGalleryItems(gallery.slice(0, 6))
      } catch (error) {
        console.warn('Gallery API unavailable', error)
      }

      try {
        const degreesData = await getDegrees()
        setDegrees(degreesData)
      } catch (error) {
        console.warn('Degrees API unavailable', error)
      }

      try {
        const experiencesData = await getExperiences()
        setExperienceItems(experiencesData)
      } catch (error) {
        console.warn('Experiences API unavailable', error)
      }

      try {
        const latestAchievements = await getAchievements()
        setAchievements(latestAchievements.slice(0, 5))
      } catch (error) {
        console.warn('Achievements API unavailable', error)
      }
    }

    load()
  }, [])

  return (
    <main className="portfolio-shell">
      <section className="hero-panel">
        <div className="hero-card">
          <div className="hero-card-inner hero-card-layout">
            <div className="hero-card-profile">
              <div className="photo-card">
                <PlaceholderMedia
                src={contact.profileImageUrl}
                alt="Dr. Md Ershad profile"
                label={contact.name || 'D'}
                wrapperClass="photo-preview"
                imageClass="photo-preview-img"
              />
                <div className="photo-input-label">Dr. Md Ershad</div>
              </div>

              <div className="hero-card-heading">Profile</div>
              <div className="profile-row">
                <span>Location</span>
                <span>Kolkata, India</span>
              </div>
              <div className="profile-row">
                <span>Current Role</span>
                <span>Assistant Professor</span>
              </div>
              <div className="profile-row">
                <span>Email</span>
                <span>{contact.email}</span>
              </div>
              <div className="profile-row">
                <span>Phone</span>
                <span>{contact.phone}</span>
              </div>
              <div className="brand-band">
                <span className="band blue" />
                <span className="band red" />
                <span className="band yellow" />
                <span className="band green" />
              </div>
            </div>

            <div className="hero-card-main">
              <div>
                <div className="hero-tagline">Academic portfolio</div>
                <h1>Dr. Md Ershad</h1>
                <p className="hero-subtitle">
                  Assistant Professor in Mechanical Engineering focused on additive manufacturing,
                  bioactive materials and modern engineering education.
                </p>
              </div>

              <div className="hero-actions hero-card-actions">
                <DownloadButton href="/Ershad Sir CV.pdf">Download CV</DownloadButton>
                <a
                  className="hero-link"
                  href={contact.scholarUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Google Scholar
                </a>
              </div>

              <p className="hero-lead">
                An educator and researcher with a record of building engineering capability through practical labs, collaborative research and project-based learning.
              </p>

              <div className="hero-badges">
                <span>IC Engines</span>
                <span>Materials &amp; Manufacturing</span>
                <span>Advanced Ceramics</span>
                <span>Student Mentorship</span>
              </div>

              <div className="hero-metrics">
                <div className="metric-card">
                  <strong>{publicationCount}</strong>
                  <span>Publications</span>
                </div>
                <div className="metric-card">
                  <strong>{galleryCount}</strong>
                  <span>Gallery items</span>
                </div>
                <div className="metric-card">
                  <strong>DrMdErshad</strong>
                  <span>Database</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-navigation">
        <div className="nav-card-grid">
          <Link to="/experience" className="nav-card">
            <h3>Experience</h3>
            <p>Explore teaching responsibilities, academic roles and course leadership.</p>
          </Link>
          <Link to="/publications" className="nav-card">
            <h3>Publications</h3>
            <p>Review peer-reviewed research, patents, and academic contributions.</p>
          </Link>
          <Link to="/gallery" className="nav-card">
            <h3>Gallery</h3>
            <p>View teaching activities, workshops, and conference highlights.</p>
          </Link>
          <Link to="/contact" className="nav-card">
            <h3>Contact</h3>
            <p>Reach out for speaking invitations, collaborations and consultancies.</p>
          </Link>
        </div>
      </section>

      <section className="section home-gallery-section">
        <div className="home-gallery-header">
          <div>
            <p className="eyebrow-label">Visual highlights</p>
            <h2>Featured gallery</h2>
          </div>
          <Link to="/gallery" className="button-primary home-gallery-action">
            View full gallery
          </Link>
        </div>

        <div className="home-gallery-grid">
          {galleryItems.length ? (
            galleryItems.map((item) => (
              <article key={item._id} className="home-gallery-card">
                <PlaceholderMedia
                  src={item.imageUrl}
                  alt={item.title}
                  label={item.title}
                  wrapperClass="home-gallery-image-wrap"
                  imageClass="home-gallery-image"
                />
                <div className="home-gallery-card-meta">
                  <div className="home-gallery-card-title">{item.title}</div>
                  <p>{item.description || 'Visual highlight from recent events and teaching activities.'}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="home-gallery-empty">No gallery highlights are available at the moment.</p>
          )}
        </div>
      </section>

      <section className="section intro-grid">
        <article className="panel highlight-panel">
          <SectionHeading title="Academic mission" eyebrow="Overview" />
          <p>
            I combine teaching excellence with applied research in manufacturing and material systems.
            My teaching covers IC engines, design, manufacturing and materials science while research
            advances bioactive glass composites and additive manufacturing applications.
          </p>
          <div className="chip-grid">
            {['Academic Leadership', 'Research Mentoring', 'Curriculum Design', 'Industry Collaboration'].map(
              (chip) => (
                <span key={chip} className="chip">
                  {chip}
                </span>
              ),
            )}
          </div>
        </article>

        <article className="panel metrics-panel">
          <SectionHeading title="Performance metrics" eyebrow="Research impact" />
          <div className="stats-grid">
            {stats.map((item) => (
              <StatBadge key={item.label} label={item.label} value={item.value} detail={item.detail} />
            ))}
          </div>
        </article>
      </section>

      <section className="section split-grid">
        <div className="panel">
          <SectionHeading title="Experience" eyebrow="Career journey" />
          <div className="timeline-list">
            {experienceItems.length > 0 ? (
              experienceItems.slice(0, 2).map((item) => (
                <TimelineItem
                  key={item._id}
                  title={item.role}
                  organization={item.institution}
                  duration={item.duration}
                  description={item.description}
                />
              ))
            ) : (
              <p>Academic experience details are managed through the dashboard.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <SectionHeading title="Education" eyebrow="Qualifications" />
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
              <p>Academic qualifications are fed from the database.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section split-grid">
        <article className="panel">
          <SectionHeading title="Achievements" eyebrow="Awards & recognition" />
          {achievements.length > 0 ? (
            <ul className="bullet-list">
              {achievements.slice(0, 2).map((achievement) => (
                <li key={achievement._id}>
                  <strong>{achievement.title}</strong>
                  {achievement.organization ? ` — ${achievement.organization}` : ''}
                  {achievement.year ? ` (${achievement.year})` : ''}
                  {achievement.description ? <p>{achievement.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>Latest achievements are managed from the admin dashboard.</p>
          )}
          <Link to="/achievements" className="button-primary">
            View all achievements
          </Link>
        </article>

        <article className="panel">
          <SectionHeading title="Research output" eyebrow="Publications & patents" />
          <div className="publication-summary">
            <div>
              <h4>Publications</h4>
              {latestPublications.length > 0 ? (
                <ul className="bullet-list">
                  {latestPublications.map((item) => (
                    <li key={item._id}>
                      <strong>{item.title}</strong>
                      {item.publisher ? ` — ${item.publisher}` : ''}
                      {item.year ? ` (${item.year})` : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent publications available.</p>
              )}
            </div>
            <div>
              <h4>Articles</h4>
              {latestArticles.length > 0 ? (
                <ul className="bullet-list">
                  {latestArticles.map((item) => (
                    <li key={item._id}>
                      <strong>{item.title}</strong>
                      {item.publisher ? ` — ${item.publisher}` : ''}
                      {item.year ? ` (${item.year})` : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent articles available.</p>
              )}
            </div>
            <div>
              <h4>Patents</h4>
              {latestPatents.length > 0 ? (
                <ul className="bullet-list">
                  {latestPatents.map((item) => (
                    <li key={item._id}>
                      <strong>{item.title}</strong>
                      {item.publisher ? ` — ${item.publisher}` : ''}
                      {item.year ? ` (${item.year})` : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent patents available.</p>
              )}
            </div>
          </div>
          <Link to="/publications" className="button-primary">
            View all publications
          </Link>
        </article>
      </section>

      <section className="section contact-panel">
        <div className="contact-home-shell">
          <div className="contact-home-copy panel">
            <SectionHeading title="Let’s connect" eyebrow="Contact" />
            <p>
              For research collaboration, guest lectures, supervision, and applied engineering consultancy,
              this is the fastest route to reach Dr. Md Ershad.
            </p>
            <div className="contact-home-features">
              <div className="feature-pill">Research collaboration</div>
              <div className="feature-pill">Academic supervision</div>
              <div className="feature-pill">Consultancy requests</div>
            </div>
            <Link to="/contact" className="button-primary contact-cta-button">
              Visit contact page
            </Link>
          </div>

          <div className="contact-home-cards">
            <article className="contact-card contact-card-large">
              <div className="contact-card-title">
                <span className="contact-card-icon contact-card-icon-email" aria-hidden="true" />
                Email
              </div>
              <a href={`mailto:${contact.email}`} className="contact-card-link">
                {contact.email}
              </a>
            </article>
            <article className="contact-card contact-card-large">
              <div className="contact-card-title">
                <span className="contact-card-icon contact-card-icon-phone" aria-hidden="true" />
                Phone
              </div>
              <a href={`tel:${contact.phone}`} className="contact-card-link">
                {contact.phone}
              </a>
            </article>
            <article className="contact-card contact-card-large">
              <div className="contact-card-title">
                <span className="contact-card-icon contact-card-icon-scholar" aria-hidden="true" />
                Scholar Profile
              </div>
              <a href={contact.scholarUrl || '#'} target="_blank" rel="noreferrer" className="contact-card-link">
                View scholar profile
              </a>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
