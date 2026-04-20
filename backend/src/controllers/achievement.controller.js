import * as achievementService from '../services/achievement.service.js'

export async function getAchievements(req, res) {
  const achievements = await achievementService.getAllAchievements()
  res.json(achievements)
}

export async function addAchievement(req, res) {
  const { title, description, organization, year, link } = req.body
  const achievement = await achievementService.createAchievement({ title, description, organization, year, link })
  res.status(201).json(achievement)
}

export async function updateAchievement(req, res) {
  const { title, description, organization, year, link } = req.body
  const achievement = await achievementService.updateAchievement(req.params.id, {
    title,
    description,
    organization,
    year,
    link,
  })
  if (!achievement) {
    res.status(404)
    throw new Error('Achievement not found')
  }
  res.json(achievement)
}

export async function removeAchievement(req, res) {
  const achievement = await achievementService.deleteAchievement(req.params.id)
  if (!achievement) {
    res.status(404)
    throw new Error('Achievement not found')
  }
  res.json({ message: 'Achievement removed' })
}
