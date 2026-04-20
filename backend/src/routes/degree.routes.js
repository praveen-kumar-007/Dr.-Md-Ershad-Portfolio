import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getDegrees,
  addDegree,
  getDegree,
  updateDegree,
  removeDegree,
} from '../controllers/degree.controller.js'

const router = express.Router()

router.route('/').get(asyncHandler(getDegrees)).post(asyncHandler(addDegree))
router.route('/:id').get(asyncHandler(getDegree)).put(asyncHandler(updateDegree)).delete(asyncHandler(removeDegree))

export default router
