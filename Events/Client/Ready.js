const Event = require('../../Structures/Classes/BaseEvent')
const { CommandHandler } = require('../../Structures/Handlers/CommandHandler')
const {
  ComponentHandler
} = require('../../Structures/Handlers/ComponentHandler')
const { loadLanguages } = require('../../Structures/Handlers/LanguageHandler')
const { ConnectMongo } = require('../../Schemas/index')
const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js')
const { Logger } = require('../../Structures/Functions/index')
const logger = new Logger()

class Ready extends Event {
  constructor(client) {
    super(client, {
      name: Events.ClientReady
    })
  }

  async execute(client) {
    setInterval(() => {
      const activitys = [
        {
          name: `Project Renatus`,
          type: ActivityType.Listening
        },
        {
          name: `Under Development`,
          type: ActivityType.Custom
        }
      ]
      const activity = activitys[Math.floor(Math.random() * activitys.length)]
      client.user.setActivity(activity)
      client.user.setStatus(PresenceUpdateStatus.Idle)
    }, 5000)

    const { loadCommands } = new CommandHandler()
    const { loadComponents } = new ComponentHandler()

    try {
      await loadLanguages()
      await loadCommands(client, client.config.deploySlashOnReady)
      await loadComponents(client)
    } catch (error) {
      logger.error(error)
    }

    logger.success(
      '==========================================================='
    )
    logger.success(`${client.user.username}(#${client.cluster.id}) is ready!`)
    logger.success(`Serving ${client.guilds.cache.size} guilds!`)
    logger.success(
      '==========================================================='
    )

    try {
      await ConnectMongo(client)
    } catch (error) {
      logger.error(error)
    }
  }
}

module.exports = Ready
