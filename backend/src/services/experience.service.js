import Experience from '../models/Experience.model.js'

export const getAllExperiences = () => Experience.find().sort({ createdAt: -1 })
export const createExperience = (data) => Experience.create(data)
export const getExperienceById = (id) => Experience.findById(id)
export const updateExperience = (id, data) => Experience.findByIdAndUpdate(id, data, { new: true })
export const deleteExperience = (id) => Experience.findByIdAndDelete(id)
