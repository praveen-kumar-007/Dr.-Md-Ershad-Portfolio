import express from 'express'
import * as achievementController from '../controllers/achievement.controller.js'

const router = express.Router()

router.get('/', achievementController.getAchievements)
router.post('/', achievementController.addAchievement)
router.put('/:id', achievementController.updateAchievement)
router.delete('/:id', achievementController.removeAchievement)

export default router
