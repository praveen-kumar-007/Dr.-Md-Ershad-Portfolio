import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contact.controller.js'

const router = express.Router()

router.route('/').get(asyncHandler(getContact)).post(asyncHandler(createContact))
router.route('/:id').put(asyncHandler(updateContact)).delete(asyncHandler(deleteContact))

export default router
