import Achievement from '../models/Achievement.model.js'

export const getAllAchievements = () => Achievement.find().sort({ createdAt: -1 })
export const createAchievement = (data) => Achievement.create(data)
export const getAchievementById = (id) => Achievement.findById(id)
export const updateAchievement = (id, data) => Achievement.findByIdAndUpdate(id, data, { new: true })
export const deleteAchievement = (id) => Achievement.findByIdAndDelete(id)
