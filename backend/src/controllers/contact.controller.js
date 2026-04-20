import cloudinary from "../config/cloudinary.js";
import * as contactService from "../services/contact.service.js";

export async function getContact(req, res) {
  const contact = await contactService.getContact();
  if (!contact) {
    res.status(404);
    throw new Error("Contact details not found");
  }
  res.json(contact);
}

export async function createContact(req, res) {
  const {
    name,
    role,
    heroTagline,
    heroSubtitle,
    heroLead,
    email,
    phone,
    address,
    scholarUrl,
    profileImageUrl,
    googleScholar,
    googleScholarDetail,
    scopus,
    scopusDetail,
    academicExperience,
    academicExperienceDetail,
    researchFocus,
    researchFocusDetail,
  } = req.body;

  const record = {
    name,
    role,
    heroTagline,
    heroSubtitle,
    heroLead,
    email,
    phone,
    address,
    scholarUrl,
    googleScholar,
    googleScholarDetail,
    scopus,
    scopusDetail,
    academicExperience,
    academicExperienceDetail,
    researchFocus,
    researchFocusDetail,
  };

  if (profileImageUrl && profileImageUrl.startsWith("data:")) {
    try {
      const uploadResult = await cloudinary.uploader.upload(profileImageUrl, {
        folder: "dr-md-ershad/profile",
      });
      record.profileImageUrl = uploadResult.secure_url;
      record.cloudinaryId = uploadResult.public_id;
    } catch (error) {
      console.warn(
        "Cloudinary upload failed, saving raw image data URL instead.",
        error?.message,
      );
      record.profileImageUrl = profileImageUrl;
    }
  } else if (profileImageUrl) {
    record.profileImageUrl = profileImageUrl;
  }

  const contact = await contactService.createContact(record);
  res.status(201).json(contact);
}

export async function updateContact(req, res) {
  const {
    name,
    role,
    heroTagline,
    heroSubtitle,
    heroLead,
    email,
    phone,
    address,
    scholarUrl,
    profileImageUrl,
    googleScholar,
    googleScholarDetail,
    scopus,
    scopusDetail,
    academicExperience,
    academicExperienceDetail,
    researchFocus,
    researchFocusDetail,
  } = req.body;
  const updateData = {
    name,
    role,
    heroTagline,
    heroSubtitle,
    heroLead,
    email,
    phone,
    address,
    scholarUrl,
    googleScholar,
    googleScholarDetail,
    scopus,
    scopusDetail,
    academicExperience,
    academicExperienceDetail,
    researchFocus,
    researchFocusDetail,
  };

  const existingContact = await contactService.getContact();
  if (!existingContact) {
    res.status(404);
    throw new Error("Contact details not found");
  }

  if (profileImageUrl && profileImageUrl.startsWith("data:")) {
    try {
      const uploadResult = await cloudinary.uploader.upload(profileImageUrl, {
        folder: "dr-md-ershad/profile",
      });
      updateData.profileImageUrl = uploadResult.secure_url;
      updateData.cloudinaryId = uploadResult.public_id;

      if (existingContact.cloudinaryId) {
        await cloudinary.uploader.destroy(existingContact.cloudinaryId);
      }
    } catch (error) {
      console.warn(
        "Cloudinary upload failed, keeping raw image data URL instead.",
        error?.message,
      );
      updateData.profileImageUrl = profileImageUrl;
    }
  } else if (profileImageUrl) {
    updateData.profileImageUrl = profileImageUrl;
  }

  const contact = await contactService.updateContact(req.params.id, updateData);
  if (!contact) {
    res.status(404);
    throw new Error("Contact details not found");
  }
  res.json(contact);
}

export async function deleteContact(req, res) {
  const contact = await contactService.deleteContact(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact details not found");
  }
  res.json({ message: "Contact removed" });
}
