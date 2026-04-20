import express from 'express'
import degreeRoutes from './degree.routes.js'
import publicationRoutes from './publication.routes.js'
import galleryRoutes from './gallery.routes.js'
import contactRoutes from './contact.routes.js'
import experienceRoutes from './experience.routes.js'
import achievementRoutes from './achievement.routes.js'
import highlightRoutes from './highlight.routes.js'
import authRoutes from './auth.routes.js'

const router = express.Router()

router.use('/degrees', degreeRoutes)
router.use('/publications', publicationRoutes)
router.use('/gallery', galleryRoutes)
router.use('/contact', contactRoutes)
router.use('/experiences', experienceRoutes)
router.use('/achievements', achievementRoutes)
router.use('/highlights', highlightRoutes)
router.use('/auth', authRoutes)

router.get('/', (req, res) => {
  res.json({ message: 'Dr. Md Ershad backend is running' })
})

export default router
