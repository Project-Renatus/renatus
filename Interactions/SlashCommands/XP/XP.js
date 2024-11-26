const Command = require('../../../Structures/Classes/BaseCommand');
const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const UserXPData = require('../../../Schemas/Users/UserXPData');
const {t} = require('i18next');

class XP extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Check your XP or another user\'s XP.')
        .setDescriptionLocalizations({
          'zh-TW': '檢查您的XP或其他用戶的XP。',
          'en-US': 'Check your XP or another user\'s XP.'
        })
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to check.')
            .setDescriptionLocalizations({
              'zh-TW': '要檢查的用戶。',
              'en-US': 'The user to check.'
            })
            .setRequired(false)
        ),
    });
  }

  /**
   * Execute the XP command
   * @param {import("discord.js").ChatInputCommandInteraction} interaction 
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client 
   */
  async execute(interaction, client, lng) {

    const targetUser = interaction.options.getUser('user') || interaction.user;

    let userData = await UserXPData.findOne({ userId: targetUser.id, guildId: interaction.guild.id });
    if (!userData) {
      userData = new UserXPData({
        userId: targetUser.id,
        guildId: interaction.guild.id,
        xp: 0,
        level: 1,
      });
      await userData.save();
    }

    const xpForNextLevel = 1000 * Math.pow(1.8, userData.level - 1);
    const progressPercentage = Math.round((userData.xp / xpForNextLevel) * 100);
    const progressBarLength = 10;
    const filledBar = '█'.repeat((progressPercentage / 10) | 0);
    const emptyBar = '─'.repeat(progressBarLength - filledBar.length);

    const displayNameL = t('command:xp.displayname', { lng});
    const levelL = t('command:xp.level', { lng });
    const xpL = t('command:xp.xp', { lng });
    const progressL = t('command:xp.progress', { lng });

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}'s XP`)
      .setColor(Colors.Blue)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: displayNameL, value: interaction.guild.members.cache.get(targetUser.id)?.displayName || 'N/A', inline: true },
        { name: levelL, value: userData.level.toString(), inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: xpL, value: `${userData.xp} / ${Math.round(xpForNextLevel)} XP`, inline: true },
        { name: progressL, value: `${filledBar}${emptyBar} ${progressPercentage}%`, inline: false }
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = XP;