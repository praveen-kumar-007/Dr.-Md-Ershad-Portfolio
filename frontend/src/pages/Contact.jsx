import { useEffect, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import '../styles/components.css'
import { getContact } from '../services/api'

function Contact() {
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    scholarUrl: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [messageData, setMessageData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await getContact()
        setContact({
          phone: data.phone,
          email: data.email,
          scholarUrl: data.scholarUrl,
          address: data.address,
        })
      } catch (error) {
        console.error('Failed to load contact details', error)
      } finally {
        setLoading(false)
      }
    }

    loadContact()
  }, [])

  const handleChange = (field) => (event) => {
    setMessageData({ ...messageData, [field]: event.target.value })
  }

  const handleSendMessage = () => {
    if (!messageData.email || !messageData.subject || !messageData.message) {
      alert('Please enter your email, subject, and message before sending.')
      return
    }

    if (!contact.email) {
      alert('Recipient email is currently unavailable.')
      return
    }

    const subject = encodeURIComponent(messageData.subject)
    const body = encodeURIComponent(
      `Name: ${messageData.name || 'N/A'}\nEmail: ${messageData.email}\n\n${messageData.message}`,
    )

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
  }

  return (
    <main className="page-content">
      <SectionHeading title="Contact" eyebrow="Connect" />

      <section className="panel highlight-panel">
        <p>
          Available for academic collaboration, research partnerships and engineering education workshops.
          Reach out to discuss curriculum design, laboratory training and applied materials research.
        </p>
      </section>

      <section className="panel contact-page-grid">
        <div className="contact-card-panel">
          <div>
            <h3>Reach out directly</h3>
            <p className="page-intro-text">
              Connect for research supervision, consulting, project collaboration and speaking opportunities.
            </p>
          </div>

          {loading ? (
            <p>Loading contact details...</p>
          ) : (
            <div className="contact-card-grid">
              <div className="contact-card">
                <div className="contact-card-title">
                  <span className="contact-card-icon contact-card-icon-email" aria-hidden="true" />
                  Email
                </div>
                <div className="contact-card-value">
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  ) : (
                    <span>Not available</span>
                  )}
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-title">
                  <span className="contact-card-icon contact-card-icon-phone" aria-hidden="true" />
                  Phone
                </div>
                <div className="contact-card-value">
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  ) : (
                    <span>Not available</span>
                  )}
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-title">
                  <span className="contact-card-icon contact-card-icon-scholar" aria-hidden="true" />
                  Scholar Profile
                </div>
                <div className="contact-card-value">
                  {contact.scholarUrl ? (
                    <a href={contact.scholarUrl} target="_blank" rel="noreferrer">
                      View profile
                    </a>
                  ) : (
                    <span>Not available</span>
                  )}
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-title">
                  <span className="contact-card-icon contact-card-icon-location" aria-hidden="true" />
                  Location
                </div>
                <div className="contact-card-value">
                  {contact.address || 'Not available'}
                </div>
              </div>
            </div>
          )}

          <div className="contact-card-footer">
            <p>
              For the fastest response, include your project brief, collaboration topic, or research question in the message form.
            </p>
          </div>
        </div>

        <div className="contact-form-panel">
          <div>
            <h3>Send a message</h3>
            <p className="page-intro-text">
              Use this form to start a conversation. Your message will open in your email client so you can review it before sending.
            </p>
          </div>

          <div className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input value={messageData.name} onChange={handleChange('name')} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={messageData.email} onChange={handleChange('email')} type="email" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input value={messageData.subject} onChange={handleChange('subject')} placeholder="Project, collaboration or query" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={messageData.message} onChange={handleChange('message')} placeholder="Tell me about your research or request" />
            </div>
            <div className="contact-form-actions">
              <button type="button" className="button-primary" onClick={handleSendMessage}>
                Compose email
              </button>
              <p className="contact-form-note">
                This will prepare a mail message with your details. You can review it before sending.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
