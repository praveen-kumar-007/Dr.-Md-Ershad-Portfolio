import Contact from '../models/Contact.model.js'

export const getContact = async () => {
  const contact = await Contact.findOne().sort({ updatedAt: -1 })
  return contact
}

export const createContact = (data) => Contact.create(data)
export const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data, { new: true })
export const deleteContact = (id) => Contact.findByIdAndDelete(id)
