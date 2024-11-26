const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Resume extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
      .setName('resume')
      .setDescription('Resume the paused track')
      .setDescriptionLocalizations({
        "en-US": 'Resume the paused track',
        "zh-TW": '繼續播放歌曲'
      })
    })
  }
}

module.exports = Resume
