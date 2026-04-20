import fs from 'fs/promises'
import path from 'path'
import { PDFParse } from 'pdf-parse'
import connectDatabase from '../src/config/db.js'
import Contact from '../src/models/Contact.model.js'
import Publication from '../src/models/Publication.model.js'
import Experience from '../src/models/Experience.model.js'
import Degree from '../src/models/Degree.model.js'
import Achievement from '../src/models/Achievement.model.js'
import Highlight from '../src/models/Highlight.model.js'

const pdfPath = path.resolve(process.cwd(), '../frontend/public/Ershad Sir CV.pdf')

const extractText = async (pdfFilePath) => {
  const fileBuffer = await fs.readFile(pdfFilePath)
  const parser = new PDFParse({ data: fileBuffer })
  await parser.load()
  const result = await parser.getText()
  if (typeof result === 'string') {
    return result
  }
  if (result && Array.isArray(result.pages)) {
    return result.pages.map((page) => page.text || '').join('\n')
  }
  return ''
}

const findFirstMatch = (text, regex) => {
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

const parseContact = (text) => {
  return {
    email: findFirstMatch(text, /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i),
    phone: findFirstMatch(text, /(\+?\d[\d\s\-().]{6,}\d)/),
    address: findFirstMatch(text, /(?:Address|Location|Based in|Based at)[:\-]?\s*([^\n]+)/i),
    scholarUrl: findFirstMatch(text, /(https?:\/\/[^\s]*scholar\.google\.com[^\s]*)/i),
    googleScholar: findFirstMatch(text, /Google Scholar\s*[:\-]?\s*([\d,]+\s*citations?)/i),
    googleScholarDetail: findFirstMatch(text, /h-index\s*(\d+)(?:.*?i10-index\s*(\d+))?/i)
      ? `h-index ${findFirstMatch(text, /h-index\s*(\d+)/i)}${findFirstMatch(text, /i10-index\s*(\d+)/i) ? `, i10-index ${findFirstMatch(text, /i10-index\s*(\d+)/i)}` : ''}`
      : '',
    scopus: findFirstMatch(text, /Scopus\s*[:\-]?\s*([\d,]+\s*citations?)/i),
    scopusDetail: findFirstMatch(text, /h-index\s*(\d+).*?Scopus/i)
      ? `h-index ${findFirstMatch(text, /Scopus.*?h-index\s*(\d+)/i)}`
      : '',
    academicExperience: findFirstMatch(text, /([0-9]+\+?\s+years?)/i),
    academicExperienceDetail: findFirstMatch(text, /(Higher education|Research|Academic).{10,60}/i),
    researchFocus: findFirstMatch(text, /(Materials & Manufacturing|Materials and Manufacturing|IC engines|Bioactive materials|3D printing)/i),
    researchFocusDetail: findFirstMatch(text, /(3D printing|bioactive materials|IC engines|materials science|additive manufacturing)/i),
  }
}

const splitSections = (text) => {
  const headings = text.match(/^(?:Education|Experience|Publications|Articles|Patents|Awards|Honors|Research Focus|Research Interests|Professional Summary|Contact).*/gim)
  if (!headings) return [{ title: 'Full CV', content: text }]

  const sectionPositions = headings.map((heading) => {
    const index = text.indexOf(heading)
    return { title: heading.trim(), index }
  })

  sectionPositions.sort((a, b) => a.index - b.index)

  return sectionPositions.map((section, index) => {
    const start = section.index + section.title.length
    const end = index + 1 < sectionPositions.length ? sectionPositions[index + 1].index : text.length
    return { title: section.title.replace(/\s+/g, ' ').trim(), content: text.slice(start, end).trim() }
  })
}

const parsePublicationLines = (sectionTitle, sectionText) => {
  const lines = sectionText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const items = []

  for (const rawLine of lines) {
    const line = rawLine.replace(/^\d+\.|•|\*|[-–—]\s*/g, '').trim()
    if (line.length < 10) continue
    const year = findFirstMatch(line, /\b(19|20)\d{2}\b/) || ''
    const publicationType = /patent/i.test(sectionTitle) ? 'Patent' : /article/i.test(sectionTitle) ? 'Article' : 'Publication'
    const pieces = line.split(/\s*[-–—]\s*|;\s*|,\s*/).map((part) => part.trim()).filter(Boolean)
    const title = pieces[0] || line
    const publisher = pieces.length > 1 ? pieces.slice(1).join(', ') : sectionTitle
    items.push({ title, publisher, year, summary: '', link: '', publicationType })
  }

  return items
}

const parseExperienceLines = (sectionText) => {
  const lines = sectionText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines
    .filter((line) => /Professor|Lecturer|Research|Engineer|Teaching|Coordinator|Head|Assistant/i.test(line))
    .map((line) => {
      const parts = line.split(/\|/).map((part) => part.trim())
      const [role = '', institution = '', duration = ''] = parts
      return { title: role || line, institution: institution || 'Academic institution', role: role || line, category: 'Teaching', duration: duration || '', location: '', description: '' }
    })
}

const parseDegreeLines = (sectionText) => {
  const lines = sectionText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines.map((line) => {
    const parts = line.split(/\|/).map((part) => part.trim())
    const [degree = '', institution = '', year = ''] = parts
    return { degree: degree || line, institution: institution || 'Institution', year, logoUrl: '', logoLabel: '', description: '' }
  })
}

const parseAchievementLines = (sectionText) => {
  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 8)
    .map((line) => ({ title: line, description: '' }))
}

const parseHighlightLines = (sectionText) => {
  return sectionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 8)
    .map((line) => ({ title: line, description: line }))
}

const main = async () => {
  console.log('Starting CV seed process...')
  await connectDatabase(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dr-md-ershad')

  const text = await extractText(pdfPath)
  const contactData = parseContact(text)
  const sections = splitSections(text)

  const publications = []
  const experiences = []
  const degrees = []
  const achievements = []
  const highlights = []

  for (const section of sections) {
    if (/publications/i.test(section.title) || /articles/i.test(section.title) || /patents/i.test(section.title)) {
      publications.push(...parsePublicationLines(section.title, section.content))
    } else if (/experience/i.test(section.title)) {
      experiences.push(...parseExperienceLines(section.content))
    } else if (/education|qualification|degree/i.test(section.title)) {
      degrees.push(...parseDegreeLines(section.content))
    } else if (/award|honor|achievement/i.test(section.title)) {
      achievements.push(...parseAchievementLines(section.content))
    } else if (/research focus|research interests|professional summary/i.test(section.title)) {
      highlights.push(...parseHighlightLines(section.content))
    }
  }

  console.log('Seeding contact data...')
  await Contact.findOneAndUpdate({}, contactData, { upsert: true, new: true })

  if (publications.length > 0) {
    console.log(`Seeding ${publications.length} publications/articles/patents...`)
    await Publication.deleteMany({})
    await Publication.insertMany(publications)
  }

  if (experiences.length > 0) {
    console.log(`Seeding ${experiences.length} experience entries...`)
    await Experience.deleteMany({})
    await Experience.insertMany(experiences)
  }

  if (degrees.length > 0) {
    console.log(`Seeding ${degrees.length} degree entries...`)
    await Degree.deleteMany({})
    await Degree.insertMany(degrees)
  }

  if (achievements.length > 0) {
    console.log(`Seeding ${achievements.length} achievements...`)
    await Achievement.deleteMany({})
    await Achievement.insertMany(achievements)
  }

  if (highlights.length > 0) {
    console.log(`Seeding ${highlights.length} highlights...`)
    await Highlight.deleteMany({})
    await Highlight.insertMany(highlights)
  }

  console.log('CV seed process complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed', err)
  process.exit(1)
})
