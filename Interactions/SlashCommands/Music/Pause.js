const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Pause extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current track')
        .setDescriptionLocalizations({
          'en-US': 'Pause the current track',
          'zh-TW': '暫停當前歌曲'
        })
    })
  }
}

module.exports = Pause
