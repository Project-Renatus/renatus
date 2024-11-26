const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Loop extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle loop for the current track')
        .setDescriptionLocalizations({
          'en-US': 'Toggle loop for the current track',
          'zh-TW': '切換當前歌曲的循環播放'
        })
    })
  }
}

module.exports = Loop
