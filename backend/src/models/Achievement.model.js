import mongoose from 'mongoose'

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    organization: { type: String, required: false },
    year: { type: String, required: false },
    link: { type: String, required: false },
  },
  { timestamps: true }
)

export default mongoose.model('Achievement', AchievementSchema)
