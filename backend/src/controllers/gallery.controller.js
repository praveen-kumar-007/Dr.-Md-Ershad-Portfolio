import cloudinary from '../config/cloudinary.js'
import * as galleryService from '../services/gallery.service.js'

export async function getGalleryItems(req, res) {
  const items = await galleryService.getAllGalleryItems()
  res.json(items)
}

export async function addGalleryItem(req, res) {
  const { title, description, imageUrl } = req.body
  const uploadResult = imageUrl
    ? await cloudinary.uploader.upload(imageUrl, { folder: 'dr-md-ershad/gallery' })
    : null

  const record = {
    title,
    description,
    imageUrl: uploadResult?.secure_url || '',
    cloudinaryId: uploadResult?.public_id || '',
  }

  const item = await galleryService.createGalleryItem(record)
  res.status(201).json(item)
}

export async function getGalleryItem(req, res) {
  const item = await galleryService.getGalleryItemById(req.params.id)
  if (!item) {
    res.status(404)
    throw new Error('Gallery item not found')
  }
  res.json(item)
}

export async function updateGalleryItem(req, res) {
  const { title, description, imageUrl } = req.body
  let updateData = { title, description }

  if (imageUrl) {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, { folder: 'dr-md-ershad/gallery' })
    updateData = {
      ...updateData,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    }
  }

  const item = await galleryService.updateGalleryItem(req.params.id, updateData)
  if (!item) {
    res.status(404)
    throw new Error('Gallery item not found')
  }
  res.json(item)
}

export async function removeGalleryItem(req, res) {
  const item = await galleryService.getGalleryItemById(req.params.id)
  if (!item) {
    res.status(404)
    throw new Error('Gallery item not found')
  }

  if (item.cloudinaryId) {
    await cloudinary.uploader.destroy(item.cloudinaryId)
  }

  await galleryService.deleteGalleryItem(req.params.id)
  res.json({ message: 'Gallery item removed' })
}
