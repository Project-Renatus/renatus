const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')
const { UserWorkData } = require('../../../Schemas/index.js')
const ms = require('ms')
const { t } = require('i18next')

class Work extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work and earn coins.')
        .setDescriptionLocalizations({
          'zh-TW': '工作並賺取金幣。',
          'en-US': 'Work and earn coins.'
        })
    })
  }

  async execute(interaction, client, lng) {
    const userId = interaction.user.id

    let userWorkData = await UserWorkData.findOne({ userId })
    if (!userWorkData) {
      userWorkData = await UserWorkData.create({
        userId,
        coins: 0,
        lastWorked: Date.now() - 1000 * 60 * 16,
        workTimes: 0
      })
    }

    const currentTime = Date.now()
    const lastWorkedTimestamp = userWorkData.lastWorked.getTime()
    const cooldown =
      lastWorkedTimestamp + (userWorkData.lastAmount < 0 ? 15 : 10) * 60 * 1000

    if (currentTime < cooldown) {
      const cooldownTime = cooldown - currentTime
      return interaction.reply({
        content: t('command:work.cooldown', {
          lng,
          time: ms(cooldownTime, { long: true })
        }),
        ephemeral: true
      })
    }

    const coinsEarned = Math.floor(Math.random() * 601) - 100
    userWorkData.coins += coinsEarned
    userWorkData.lastWorked = currentTime
    userWorkData.lastAmount = coinsEarned
    userWorkData.workTimes += 1

    await userWorkData.save()

    const responseKey =
      coinsEarned >= 0
        ? 'command:work.success.positive'
        : 'command:work.success.negative'
    interaction.reply({
      content: t(responseKey, { lng, coins: Math.abs(coinsEarned) }),
      ephemeral: false
    })
  }
}

module.exports = Work
