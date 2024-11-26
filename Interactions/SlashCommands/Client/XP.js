const Command = require('../../../Structures/Classes/BaseCommand');
const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const UserXPData = require('../../../Schemas/Users/UserXPData');

class XP extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Check your XP or another user\'s XP.')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to check.')
            .setRequired(false)
        ),
    });
  }

  /**
   * Execute the XP command
   * @param {import("discord.js").ChatInputCommandInteraction} interaction 
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client 
   */
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    // Fetch or initialize user XP data
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

    // Calculate XP for next level
    const xpForNextLevel = 1000 * Math.pow(1.8, userData.level - 1);
    const progressPercentage = Math.round((userData.xp / xpForNextLevel) * 100);
    const progressBarLength = 10; // Define the length of your progress bar
    const filledBar = '█'.repeat((progressPercentage / 10) | 0);
    const emptyBar = '─'.repeat(progressBarLength - filledBar.length);

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}'s XP`)
      .setColor(Colors.Blue)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Username', value: targetUser.username, inline: true },
        { name: 'Display Name', value: interaction.guild.members.cache.get(targetUser.id)?.displayName || 'N/A', inline: true },
        { name: 'Level', value: userData.level.toString(), inline: true },
        { name: 'XP', value: `${userData.xp} / ${Math.round(xpForNextLevel)} XP`, inline: true },
        { name: 'Progress', value: `${filledBar}${emptyBar} ${progressPercentage}%`, inline: false }
      );

    // Respond with the embed
    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = XP;