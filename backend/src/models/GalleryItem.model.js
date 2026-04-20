import mongoose from 'mongoose'

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    cloudinaryId: { type: String, required: false },
  },
  { timestamps: true }
)

export default mongoose.model('GalleryItem', GalleryItemSchema)
