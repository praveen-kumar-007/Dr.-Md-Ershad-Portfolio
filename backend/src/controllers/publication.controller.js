import cloudinary from '../config/cloudinary.js'
import * as publicationService from '../services/publication.service.js'

export async function getPublications(req, res) {
  const filter = {}
  if (req.query.category) {
    filter.publicationType = req.query.category
  }
  const publications = await publicationService.getAllPublications(filter)
  res.json(publications)
}

export async function addPublication(req, res) {
  const { title, publisher, year, summary, link, publicationType, imageUrl } = req.body
  let record = { title, publisher, year, summary, link, publicationType }

  if (imageUrl) {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dr-md-ershad/publications',
    })
    record = {
      ...record,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    }
  }

  const publication = await publicationService.createPublication(record)
  res.status(201).json(publication)
}

export async function getPublication(req, res) {
  const publication = await publicationService.getPublicationById(req.params.id)
  if (!publication) {
    res.status(404)
    throw new Error('Publication not found')
  }
  res.json(publication)
}

export async function updatePublication(req, res) {
  const { title, publisher, year, summary, link, publicationType, imageUrl } = req.body
  const updateData = { title, publisher, year, summary, link, publicationType }

  if (imageUrl && imageUrl.startsWith('data:')) {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dr-md-ershad/publications',
    })
    updateData.imageUrl = uploadResult.secure_url
    updateData.cloudinaryId = uploadResult.public_id
  } else if (imageUrl) {
    updateData.imageUrl = imageUrl
  }

  const publication = await publicationService.updatePublication(req.params.id, updateData)
  if (!publication) {
    res.status(404)
    throw new Error('Publication not found')
  }
  res.json(publication)
}

export async function removePublication(req, res) {
  const publication = await publicationService.deletePublication(req.params.id)
  if (!publication) {
    res.status(404)
    throw new Error('Publication not found')
  }
  res.json({ message: 'Publication removed' })
}
