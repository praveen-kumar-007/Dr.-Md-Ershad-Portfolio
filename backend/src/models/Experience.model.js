import mongoose from 'mongoose'

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    institution: { type: String, required: true },
    role: { type: String, required: true },
    category: {
      type: String,
      enum: ['Teaching', 'Research', 'Administration', 'Visiting', 'Other'],
      default: 'Teaching',
    },
    duration: { type: String, required: true },
    location: { type: String, required: false },
    description: { type: String, required: false },
    logoUrl: { type: String, required: false },
    cloudinaryId: { type: String, required: false },
  },
  { timestamps: true }
)

export default mongoose.model('Experience', ExperienceSchema)
