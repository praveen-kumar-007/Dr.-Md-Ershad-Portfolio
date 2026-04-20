import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    role: { type: String, required: false },
    heroTagline: { type: String, required: false },
    heroSubtitle: { type: String, required: false },
    heroLead: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: false },
    scholarUrl: { type: String, required: false },
    profileImageUrl: { type: String, required: false },
    cloudinaryId: { type: String, required: false },
    services: [{ type: String }],
    googleScholar: { type: String, required: false },
    googleScholarDetail: { type: String, required: false },
    scopus: { type: String, required: false },
    scopusDetail: { type: String, required: false },
    academicExperience: { type: String, required: false },
    academicExperienceDetail: { type: String, required: false },
    researchFocus: { type: String, required: false },
    researchFocusDetail: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", ContactSchema);
