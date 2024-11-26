const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Skip extends Command {
  constructor(client, dir) {
    super(client, dir, {
        data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current track')
        .setDescriptionLocalizations({
          "en-US": 'Skip the current track',
          "zh-TW": '跳過當前歌曲'
        })
    })
  }
}

module.exports = Skip
