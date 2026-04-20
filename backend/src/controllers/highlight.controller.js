import * as highlightService from '../services/highlight.service.js'

export async function getHighlights(req, res) {
  const highlights = await highlightService.getAllHighlights()
  res.json(highlights)
}

export async function addHighlight(req, res) {
  const { title, description, category, link } = req.body
  const highlight = await highlightService.createHighlight({ title, description, category, link })
  res.status(201).json(highlight)
}

export async function updateHighlight(req, res) {
  const { title, description, category, link } = req.body
  const highlight = await highlightService.updateHighlight(req.params.id, {
    title,
    description,
    category,
    link,
  })
  if (!highlight) {
    res.status(404)
    throw new Error('Highlight not found')
  }
  res.json(highlight)
}

export async function removeHighlight(req, res) {
  const highlight = await highlightService.deleteHighlight(req.params.id)
  if (!highlight) {
    res.status(404)
    throw new Error('Highlight not found')
  }
  res.json({ message: 'Highlight removed' })
}
