import Publication from '../models/Publication.model.js'

export const getAllPublications = (filter = {}) => Publication.find(filter).sort({ year: -1 })
export const createPublication = (data) => Publication.create(data)
export const getPublicationById = (id) => Publication.findById(id)
export const updatePublication = (id, data) => Publication.findByIdAndUpdate(id, data, { new: true })
export const deletePublication = (id) => Publication.findByIdAndDelete(id)
