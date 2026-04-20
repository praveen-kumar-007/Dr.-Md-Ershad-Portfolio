import Degree from '../models/Degree.model.js'

export const getAllDegrees = () => Degree.find().sort({ year: -1 })
export const createDegree = (data) => Degree.create(data)
export const getDegreeById = (id) => Degree.findById(id)
export const updateDegree = (id, data) => Degree.findByIdAndUpdate(id, data, { new: true })
export const deleteDegree = (id) => Degree.findByIdAndDelete(id)
