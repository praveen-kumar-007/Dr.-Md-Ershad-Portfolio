import cloudinary from '../config/cloudinary.js'
import * as degreeService from '../services/degree.service.js'

export async function getDegrees(req, res) {
  const degrees = await degreeService.getAllDegrees()
  res.json(degrees)
}

export async function addDegree(req, res) {
  const { degree, institution, year, score, description, logoUrl, logoLabel } = req.body
  let record = { degree, institution, year, score, description, logoLabel }

  if (logoUrl) {
    const uploadResult = await cloudinary.uploader.upload(logoUrl, {
      folder: 'dr-md-ershad/degrees',
    })
    record.logoUrl = uploadResult.secure_url
    record.cloudinaryId = uploadResult.public_id
  }

  const newDegree = await degreeService.createDegree(record)
  res.status(201).json(newDegree)
}

export async function getDegree(req, res) {
  const degree = await degreeService.getDegreeById(req.params.id)
  if (!degree) {
    res.status(404)
    throw new Error('Degree not found')
  }
  res.json(degree)
}

export async function updateDegree(req, res) {
  const { degree, institution, year, score, description, logoUrl, logoLabel } = req.body
  const updateData = { degree, institution, year, score, description, logoLabel }

  const existingDegree = await degreeService.getDegreeById(req.params.id)
  if (!existingDegree) {
    res.status(404)
    throw new Error('Degree not found')
  }

  if (logoUrl && logoUrl.startsWith('data:')) {
    if (existingDegree.cloudinaryId) {
      await cloudinary.uploader.destroy(existingDegree.cloudinaryId)
    }
    const uploadResult = await cloudinary.uploader.upload(logoUrl, {
      folder: 'dr-md-ershad/degrees',
    })
    updateData.logoUrl = uploadResult.secure_url
    updateData.cloudinaryId = uploadResult.public_id
  } else if (logoUrl) {
    updateData.logoUrl = logoUrl
  }

  const updatedDegree = await degreeService.updateDegree(req.params.id, updateData)
  if (!updatedDegree) {
    res.status(404)
    throw new Error('Degree not found')
  }
  res.json(updatedDegree)
}

export async function removeDegree(req, res) {
  const degree = await degreeService.getDegreeById(req.params.id)
  if (!degree) {
    res.status(404)
    throw new Error('Degree not found')
  }

  if (degree.cloudinaryId) {
    await cloudinary.uploader.destroy(degree.cloudinaryId)
  }

  await degreeService.deleteDegree(req.params.id)
  res.json({ message: 'Degree removed' })
}
