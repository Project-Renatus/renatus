const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class List extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
      .setName('list')
      .setDescription('List the current songs in queue')
      .setDescriptionLocalizations({ 
        "en-US": 'List the current songs in queue',
        "zh-TW": '列出當前隊列中的歌曲'
      }),
    })
  }
}

module.exports = List
