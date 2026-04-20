import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { createContact, createPublication, getContact, updateContact } from '../services/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const parseTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pageTexts = []

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    pageTexts.push(pageText)
  }

  return pageTexts.join('\n')
}

const extractEmail = (text) => {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return match ? match[0] : ''
}

const extractPhone = (text) => {
  const match = text.match(/(\+?\d[\d\s\-().]{6,}\d)/)
  return match ? match[0].trim() : ''
}

const extractScholarUrl = (text) => {
  const match = text.match(/https?:\/\/[^\s]*scholar\.google\.com[^\s]*/i)
  return match ? match[0] : ''
}

const extractAddress = (text) => {
  const addressMatch = text.match(/(?:Address|Location|Based in)[:\-]?\s*([^\n]+)/i)
  if (addressMatch) return addressMatch[1].trim()

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const locationLine = lines.find((line) => /Kolkata|India|West Bengal|Bengaluru|Chennai|Delhi/i.test(line))
  return locationLine || ''
}

const splitSections = (text) => {
  const normalized = text.replace(/\r/g, '\n')
  const sectionRegex = /(Publications|Articles|Patents|Research Publications|Research Articles|Patent)/gi
  const headings = []
  let match

  while ((match = sectionRegex.exec(normalized)) !== null) {
    headings.push({ title: match[1], index: match.index })
  }

  if (headings.length === 0) {
    return [{ title: 'Publications', content: normalized }]
  }

  const sections = []
  for (let i = 0; i < headings.length; i += 1) {
    const start = headings[i].index
    const end = i + 1 < headings.length ? headings[i + 1].index : normalized.length
    const content = normalized.slice(start + headings[i].title.length, end).trim()
    sections.push({ title: headings[i].title, content })
  }

  return sections
}

const parsePublicationLines = (sectionName, text) => {
  const items = text
    .split(/\n{2,}|\n-+\n|\n•|\n\*|\n/) 
    .map((line) => line.trim())
    .filter((line) => line.length > 8)

  const parsed = []

  items.forEach((item) => {
    const yearMatch = item.match(/\b(19|20)\d{2}\b/)
    const year = yearMatch ? yearMatch[0] : ''
    const cleanLine = item.replace(/\b(19|20)\d{2}\b/, '').trim()
    const parts = cleanLine.split(/\s+[-–—]\s+|,\s*|;\s*/) 
      .map((part) => part.trim())
      .filter(Boolean)

    let title = cleanLine
    let publisher = ''

    if (parts.length >= 2) {
      title = parts[0]
      publisher = parts.slice(1).join(', ')
    }

    if (!title || title.length < 4) {
      return
    }

    parsed.push({
      title,
      publisher: publisher || sectionName,
      year: year || '',
      summary: '',
      link: '',
      publicationType: /patent/i.test(sectionName) ? 'Patent' : /article/i.test(sectionName) ? 'Article' : 'Publication',
    })
  })

  return parsed
}

const CVImportAdmin = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
    setPreview(null)
    setStatus('')
  }

  const handleImport = async () => {
    if (!file) {
      alert('Please choose the CV PDF file first.')
      return
    }

    try {
      setIsImporting(true)
      setStatus('Reading CV and extracting content...')
      const text = await parseTextFromPdf(file)

      const email = extractEmail(text)
      const phone = extractPhone(text)
      const scholarUrl = extractScholarUrl(text)
      const address = extractAddress(text)

      const sections = splitSections(text)
      const publications = sections.flatMap((section) => parsePublicationLines(section.title, section.content))

      setPreview({ email, phone, scholarUrl, address, publications })
      setStatus(
        `Found ${publications.length} publication entries. Contact details extracted: ${email ? 'email' : 'no email'}, ${phone ? 'phone' : 'no phone'}.`
      )
    } catch (error) {
      console.error(error)
      setStatus('Failed to extract CV text. Please use a readable PDF and try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleSave = async () => {
    if (!preview) {
      alert('No extracted data available to save yet.')
      return
    }

    try {
      setIsImporting(true)
      setStatus('Saving extracted data to MongoDB...')

      const contactPayload = {
        email: preview.email || '',
        phone: preview.phone || '',
        address: preview.address || '',
        scholarUrl: preview.scholarUrl || '',
      }

      try {
        const existingContact = await getContact()
        await updateContact(existingContact._id, contactPayload)
      } catch {
        await createContact(contactPayload)
      }

      for (const publication of preview.publications) {
        if (publication.title && publication.publisher) {
          await createPublication(publication)
        }
      }

      setStatus('Import complete. Publication and contact data have been saved. You can now edit them in the admin panels.')
    } catch (error) {
      console.error(error)
      setStatus('Failed to save extracted data. Check the console and try again.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Import CV</h1>
        <p>Upload the CV PDF and automatically populate contact, publications, articles, and patents into the database.</p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Choose CV PDF</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-button" onClick={handleImport} disabled={!file || isImporting}>
            Extract from CV
          </button>
          <button type="button" className="admin-button" onClick={handleSave} disabled={!preview || isImporting}>
            Save Extracted Data
          </button>
        </div>
        {status ? <p>{status}</p> : null}
      </div>

      {preview ? (
        <div className="admin-form-panel">
          <div className="form-group">
            <label>Extracted email</label>
            <input value={preview.email} readOnly />
          </div>
          <div className="form-group">
            <label>Extracted phone</label>
            <input value={preview.phone} readOnly />
          </div>
          <div className="form-group">
            <label>Extracted address</label>
            <input value={preview.address} readOnly />
          </div>
          <div className="form-group">
            <label>Extracted scholar URL</label>
            <input value={preview.scholarUrl} readOnly />
          </div>
          <div className="form-group full-width">
            <label>Publications / Articles / Patents found</label>
            <div className="import-preview-list">
              {preview.publications.map((publication, index) => (
                <div key={`${publication.title}-${index}`} className="import-preview-item">
                  <strong>{publication.title}</strong>
                  <div>{publication.publisher} · {publication.year} · {publication.publicationType}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CVImportAdmin
