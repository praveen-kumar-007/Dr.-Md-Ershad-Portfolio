import cloudinary from '../config/cloudinary.js'
import * as experienceService from '../services/experience.service.js'

export async function getExperiences(req, res) {
  const experiences = await experienceService.getAllExperiences()
  res.json(experiences)
}

export async function addExperience(req, res) {
  const { title, institution, role, category, duration, location, description, logoUrl } = req.body

  let record = {
    title,
    institution,
    role,
    category,
    duration,
    location,
    description,
  }

  if (logoUrl) {
    const uploadResult = await cloudinary.uploader.upload(logoUrl, {
      folder: 'dr-md-ershad/experience',
    })
    record = {
      ...record,
      logoUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    }
  }

  const experience = await experienceService.createExperience(record)
  res.status(201).json(experience)
}

export async function getExperience(req, res) {
  const experience = await experienceService.getExperienceById(req.params.id)
  if (!experience) {
    res.status(404)
    throw new Error('Experience not found')
  }
  res.json(experience)
}

export async function updateExperience(req, res) {
  const { title, institution, role, category, duration, location, description, logoUrl } = req.body
  const updateData = { title, institution, role, category, duration, location, description }

  if (logoUrl && logoUrl.startsWith('data:')) {
    const uploadResult = await cloudinary.uploader.upload(logoUrl, {
      folder: 'dr-md-ershad/experience',
    })
    updateData.logoUrl = uploadResult.secure_url
    updateData.cloudinaryId = uploadResult.public_id
  } else if (logoUrl) {
    updateData.logoUrl = logoUrl
  }

  const experience = await experienceService.updateExperience(req.params.id, updateData)
  if (!experience) {
    res.status(404)
    throw new Error('Experience not found')
  }
  res.json(experience)
}

export async function removeExperience(req, res) {
  const experience = await experienceService.getExperienceById(req.params.id)
  if (!experience) {
    res.status(404)
    throw new Error('Experience not found')
  }

  if (experience.cloudinaryId) {
    await cloudinary.uploader.destroy(experience.cloudinaryId)
  }

  await experienceService.deleteExperience(req.params.id)
  res.json({ message: 'Experience removed' })
}
