import mongoose from 'mongoose'

const DegreeSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    logoUrl: { type: String, required: false },
    logoLabel: { type: String, required: false },
    cloudinaryId: { type: String, required: false },
    year: { type: String, required: false },
    score: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
)

export default mongoose.model('Degree', DegreeSchema)
