const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Playing extends Command {
  constructor(client, dir) {
    super(client, dir, {
        data: new SlashCommandBuilder()
        .setName('playing')
        .setDescription('Shows the current playing song information')
        .setDescriptionLocalizations({
          "en-US": 'Shows the current playing song information',
          "zh-TW": '顯示當前播放歌曲的信息'
        })
    })
  }
}

module.exports = Playing
