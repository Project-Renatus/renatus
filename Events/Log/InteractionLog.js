const Event = require('../../Structures/Classes/BaseEvent')
const { botDatas } = require('../../Schemas/index.js')
const { Events, CommandInteraction, InteractionType } = require('discord.js')

class InteractionLog extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate
    })
  }

  async execute(interaction) {
    const { client } = this
    if (
      interaction instanceof CommandInteraction &&
      interaction.type === InteractionType.ApplicationCommand
    ) {
      const command = client.slashCommands.get(interaction.commandName)
      if (!command) return

      let botData = await botDatas.findOne()

      if (!botData) {
        await botDatas.create()
        botData = await botDatas.findOne()
      }
    }
  }
}

module.exports = InteractionLog
