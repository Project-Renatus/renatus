const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { t } = require('i18next')

class Language extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('Set a language for this server.')
        .setDescriptionLocalizations({
          'zh-TW': '設置此伺服器的語言',
          'en-US': 'Set a language for this server.'
        })
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription('Select a language.')
            .setRequired(true)
            .addChoices([
              { name: 'English', value: 'en' },
              { name: '中文', value: 'zh-TW' }
            ])
        )
    })
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   */
  async execute(interaction, client) {
    const lng = interaction.options.getString('language')
    await client.db.languageDatas.findOneAndUpdate(
      {
        guildId: interaction.guildId
      },
      { lng: lng }
    )

    interaction.reply({
      content: t('command:language.success', {
        lng: lng,
        data:
          lng == 'en'
            ? 'English'
            : lng == 'zh-TW'
              ? '繁體中文'
              : '',
        user: interaction.user.id
      })
    })
  }
}

module.exports = Language
