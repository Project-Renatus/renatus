const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserWorkData } = require('../../../Schemas/index.js');
const { t } = require('i18next');

class Balance extends Command {
    constructor(client, dir) {
      super(client, dir, {
        data: new SlashCommandBuilder()
          .setName('balance')
          .setDescription('Display a user’s coins, work times, and other info.')
          .setDescriptionLocalizations({
            'zh-TW': '顯示使用者的金幣、工作次數和其他資訊。',
            'en-US': 'Display a user’s coins, work times, and other info.'
          })
          .addUserOption(option =>
            option.setName('target')
              .setDescription('Select a user to view their data.')
              .setDescriptionLocalizations({
                'zh-TW': '選擇一個使用者以查看其資料。',
                'en-US': 'Select a user to view their data.'
              })
          )
      });
    }
    
    async execute(interaction, client, lng) {
      const targetUser = interaction.options.getUser('target') || interaction.user;
      const member = await interaction.guild.members.fetch(targetUser.id);
      const userWorkData = await UserWorkData.findOne({ userId: targetUser.id });
  
      if (!userWorkData) {
        return interaction.reply({
          content: t('command:workData.nodata', { lng }),
          ephemeral: true
        });
      }
  
      const userEmbed = new EmbedBuilder()
        .setTitle(t('command:workData.embedTitle', { lng, username: targetUser.username }))
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true })) 
        .addFields(
          { name: t('command:workData.displayName', { lng }), value: member.displayName || targetUser.username, inline: true },
          { name: t('command:workData.coins', { lng }), value: userWorkData.coins.toString(), inline: true },
          { name: t('command:workData.workTimes', { lng }), value: userWorkData.workTimes.toString(), inline: true }
        )
        .setColor(0x00AE86);
  
      interaction.reply({ embeds: [userEmbed] });
    }
  }
  
  module.exports = Balance;