const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder } = require('discord.js')
const { DynamicChannel } = require('../../../Schemas')
const { t } = require('i18next')

class DynamicVoiceChannel extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('dvc')
        .setDescription('Manage dynamic voice channels.')
        .setDescriptionLocalizations({
          'zh-TW': '管理動態語音頻道',
          'en-US': 'Manage dynamic voice channels.'
        })
        .addSubcommand((subcommand) =>
          subcommand
            .setName('create')
            .setDescription('Create a dynamic voice channel setup.')
            .setDescriptionLocalizations({
              'zh-TW': '建立動態語音頻道設置',
              'en-US': 'Create a dynamic voice channel setup.'
            })
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('disable')
            .setDescription(
               'Disable and delete the dynamic voice channel setup.'
            )
            .setDescriptionLocalizations({
              'zh-TW': '停用並刪除動態語音頻道設置',
              'en-US': 'Disable and delete the dynamic voice channel setup.'
            })
        )
    })
  }

  async execute(interaction, client, lng) {
    const subcommand = interaction.options.getSubcommand()
    const guild = interaction.guild

    try {
      if (subcommand === 'create') {
        const existingChannel = await DynamicChannel.findOne({
          guildId: guild.id,
          userId: 'system'
        })

        if (!existingChannel) {
          const categoryName = t('command:dvc.category.create', {
            lng
          })
          const channelName = t('command:dvc.channel.join', { lng })

          // Create the category
          const category = await guild.channels.create({
            name: categoryName,
            type: 4
          })

          // Create the "Join to Create" voice channel
          const joinChannel = await guild.channels.create({
            name: channelName,
            type: 2,
            parent: category.id
          })

          // Store the shared channel and category ID
          await new DynamicChannel({
            userId: 'system',
            channelId: joinChannel.id,
            categoryId: category.id,
            guildId: guild.id
          }).save()

          interaction.reply({
            content: t('command:dvc.setupComplete', { lng }),
            ephemeral: true
          })
        } else {
          interaction.reply({
            content: t('command:dvc.alreadySetUp', { lng }),
            ephemeral: true
          })
        }
      } else if (subcommand === 'disable') {
        // Remove the setup and related entries
        const systemEntry = await DynamicChannel.findOne({
          guildId: guild.id,
          userId: 'system'
        })
        if (systemEntry) {
          // Remove the join channel
          const joinChannel = guild.channels.cache.get(systemEntry.channelId)
          if (joinChannel) {
            await joinChannel.delete()
          }

          // Remove the category
          const category = guild.channels.cache.get(systemEntry.categoryId)
          if (category) {
            await category.delete()
          }

          // Remove all DB entries related to the server
          await DynamicChannel.deleteMany({ guildId: guild.id })

          interaction.reply({
            content:
              t('command:dvc.disabled', { lng }),
            ephemeral: true
          })
        } else {
          interaction.reply({
            content: t('command:dvc.noExist', { lng }),
            ephemeral: true
          })
        }
      }
    } catch (err) {
      interaction.reply({
        content: `\`ERROR\` \n\`\`\`xl\n${err}\n\`\`\``,
        ephemeral: true
      })
    }
  }
}

module.exports = DynamicVoiceChannel
