import Highlight from '../models/Highlight.model.js'

export const getAllHighlights = () => Highlight.find().sort({ createdAt: -1 })
export const createHighlight = (data) => Highlight.create(data)
export const getHighlightById = (id) => Highlight.findById(id)
export const updateHighlight = (id, data) => Highlight.findByIdAndUpdate(id, data, { new: true })
export const deleteHighlight = (id) => Highlight.findByIdAndDelete(id)
