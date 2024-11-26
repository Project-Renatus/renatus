const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')

class Play extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(
          'Search for a song on SoundCloud and add it to the queue'
        )
        .setDescriptionLocalizations({
          'en-US': 'Search for a song on SoundCloud and add it to the queue',
          'zh-TW': '在 SoundCloud 上搜索歌曲並將其添加到隊列中'
        })
        .addStringOption((option) =>
          option
            .setName('query')
            .setNameLocalizations({
              'en-US': 'query',
              'zh-TW': '搜索'
            })
            .setDescription('Search query for tracks')
            .setDescriptionLocalizations({
              'en-US': 'Search query for tracks',
              'zh-TW': '歌曲名字/關鍵字'
            })
            .setRequired(true)
        )
    })
  }
}

module.exports = Play
