const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Stop extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue')
        .setDescriptionLocalizations({
          'en-US': 'Stop the music and clear the queue',
          'zh-TW': '停止播放音樂並清空隊列'
        })
    })
  }
}

module.exports = Stop
