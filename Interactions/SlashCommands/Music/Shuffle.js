const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Shuffle extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue')
        .setDescriptionLocalizations({
          'en-US': 'Shuffle the current queue',
          'zh-TW': '隨機播放當前隊列'
        })
    })
  }
}

module.exports = Shuffle
