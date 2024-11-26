const Command = require('../../../Structures/Classes/BaseCommand');
const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const UserXPData = require('../../../Schemas/Users/UserXPData');
const { t } = require('i18next');

class XPLeaderboard extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('xpleaderboard')
        .setDescription('Check the XP leaderboard for the current server or all servers.')
        .setDescriptionLocalizations({
          'zh-TW': '檢查當前服務器或所有服務器的XP排行榜。',
          'en-US': 'Check the XP leaderboard for the current server or all servers.'
        })
        .addBooleanOption(option =>
          option
            .setName('all')
            .setDescription('Check the leaderboard for all servers')
            .setDescriptionLocalizations({
              'zh-TW': '檢查所有服務器的排行榜',
              'en-US': 'Check the leaderboard for all servers'
            })
            .setRequired(false)
        ),
    });
  }

  /**
   * Execute the XPLeaderboard command
   * @param {import("discord.js").ChatInputCommandInteraction} interaction 
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client 
   */
  async execute(interaction, client, lng) {
    const checkAllServers = interaction.options.getBoolean('all') || false;
    const filter = checkAllServers ? {} : { guildId: interaction.guild.id };

    const topUsers = await UserXPData.find(filter).sort({ xp: -1 }).limit(20);

    if (!topUsers.length) {
      return interaction.reply(t('command:xpleaderboard.nousers', { lng }));
    }

    const leaderboardTitle = checkAllServers ? t('command:xpleaderboard.servers', { lng }) : t('command:xpleaderboard.server', { lng });

    const leaderboardEntries = topUsers.map((userData, index) => {
      const user = client.users.cache.get(userData.userId);
      const username = user ? user.username : t('command:xpleaderboard.unknownuser', { lng });
      return `${index + 1}. ${username} - ${userData.xp} ${t('command:xpleaderboard.title_xp', { lng })}`;
    }).join('\n');

    const leaderboardEmbed = new EmbedBuilder()
      .setTitle(`${leaderboardTitle}`)
      .setColor(Colors.Gold)
      .setFooter({ text: t('command:xpleaderboard.footer', { lng }) })
      .setDescription(leaderboardEntries);

    await interaction.reply({ embeds: [leaderboardEmbed] });
  }
}

module.exports = XPLeaderboard;