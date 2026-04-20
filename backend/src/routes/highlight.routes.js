import express from 'express'
import * as highlightController from '../controllers/highlight.controller.js'

const router = express.Router()

router.get('/', highlightController.getHighlights)
router.post('/', highlightController.addHighlight)
router.put('/:id', highlightController.updateHighlight)
router.delete('/:id', highlightController.removeHighlight)

export default router
