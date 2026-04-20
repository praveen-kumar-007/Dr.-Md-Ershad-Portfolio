import mongoose from 'mongoose'

const PublicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publisher: { type: String, required: true },
    year: { type: String, required: true },
    publicationType: {
      type: String,
      enum: ['Publication', 'Article', 'Patent'],
      default: 'Publication',
    },
    link: { type: String, required: false },
    summary: { type: String, required: false },
    imageUrl: { type: String, required: false },
    cloudinaryId: { type: String, required: false },
  },
  { timestamps: true }
)

export default mongoose.model('Publication', PublicationSchema)
