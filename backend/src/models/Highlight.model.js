import mongoose from 'mongoose'

const HighlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: false },
    link: { type: String, required: false },
  },
  { timestamps: true }
)

export default mongoose.model('Highlight', HighlightSchema)
