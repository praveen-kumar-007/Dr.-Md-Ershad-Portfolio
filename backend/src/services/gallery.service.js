import GalleryItem from '../models/GalleryItem.model.js'

export const getAllGalleryItems = () => GalleryItem.find().sort({ createdAt: -1 })
export const createGalleryItem = (data) => GalleryItem.create(data)
export const getGalleryItemById = (id) => GalleryItem.findById(id)
export const updateGalleryItem = (id, data) => GalleryItem.findByIdAndUpdate(id, data, { new: true })
export const deleteGalleryItem = (id) => GalleryItem.findByIdAndDelete(id)
