import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getPublications,
  addPublication,
  getPublication,
  updatePublication,
  removePublication,
} from '../controllers/publication.controller.js'

const router = express.Router()

router.route('/').get(asyncHandler(getPublications)).post(asyncHandler(addPublication))
router.route('/:id').get(asyncHandler(getPublication)).put(asyncHandler(updatePublication)).delete(asyncHandler(removePublication))

export default router
