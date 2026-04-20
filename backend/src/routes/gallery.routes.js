import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  getGalleryItems,
  addGalleryItem,
  getGalleryItem,
  updateGalleryItem,
  removeGalleryItem,
} from '../controllers/gallery.controller.js'

const router = express.Router()

router.route('/').get(asyncHandler(getGalleryItems)).post(asyncHandler(addGalleryItem))
router.route('/:id').get(asyncHandler(getGalleryItem)).put(asyncHandler(updateGalleryItem)).delete(asyncHandler(removeGalleryItem))

export default router
