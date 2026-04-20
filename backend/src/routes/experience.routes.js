import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getExperiences,
  addExperience,
  getExperience,
  updateExperience,
  removeExperience,
} from '../controllers/experience.controller.js'

const router = express.Router()

router.route('/').get(asyncHandler(getExperiences)).post(asyncHandler(addExperience))
router.route('/:id').get(asyncHandler(getExperience)).put(asyncHandler(updateExperience)).delete(asyncHandler(removeExperience))

export default router
