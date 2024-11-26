const Command = require('../../../Structures/Classes/BaseCommand')
const { SlashCommandBuilder, Colors, EmbedBuilder } = require('discord.js')
const { PaginationEmbed } = require('../../../Structures/Functions/index')
const {t} = require('i18next')

class Help extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command')
        .setDescriptionLocalizations({
          'zh-TW': '幫助',
          'en-US': 'Help command'
        })
    })
  }

  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   */
  async execute(interaction, client) {
    let adminCmd = []
    let clientCmd = []
    let infoCmd = []
    let othersCmd = []
    let cityCmd = []
    let dvcCmd = []
    let xpCmd = []
    let musicCmd = []

    let lng = interaction.locale

    const cmdPush = (category, subCmd, command) => {
      try {
        switch (category.category) {
          case 'Client':
            if (subCmd.length !== 0) infoCmd.push(...subCmd)
            else
              clientCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.descriptionLocalizations[lng],
                inline: true
              })
            break
          case 'Admin':
            if (subCmd.length !== 0) adminCmd.push(...subCmd)
            else
              adminCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.descriptionLocalizations[lng],
                inline: true
              })
            break
          case 'Music':
              if (subCmd.length !== 0) musicCmd.push(...subCmd)
              else
                musicCmd.push({
                  name: `</${command.name}:${command.id}>`,
                  value: command.descriptionLocalizations[lng],
                  inline: true
                })
              break
          case 'City':
            if (subCmd.length !== 0) cityCmd.push(...subCmd)
            else
              cityCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.descriptionLocalizations[lng],
                inline: true
              })
            break
          case 'Dvc':
            if (subCmd.length !== 0) dvcCmd.push(...subCmd)
            else
              dvcCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.descriptionLocalizations[lng],
                inline: true
              })
            break
          case 'XP':
            if (subCmd.length !== 0) xpCmd.push(...subCmd)
            else
              xpCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.descriptionLocalizations[lng],
                inline: true
              })
            break
          default:
            if (subCmd.length !== 0) othersCmd.push(...subCmd)
            else
              othersCmd.push({
                name: `</${command.name}:${command.id}>`,
                value: command.descriptionLocalizations[lng],
                inline: true
              })
            break
        }
      } catch (error) {
        console.log(error)
      }
    }

    await client.application.commands
      .fetch({ withLocalizations: true })
      .then((commands) => {
        commands.forEach((command) => {
          let subCmd = []
          command.options.forEach((option) => {
            if (option.type == 1) {
              subCmd.push({
                name: `</${command.name + ' ' + option.name}:${command.id}>`,
                value: option.descriptionLocalizations[lng],
                inline: true
              })
            }
          })
          const ctg = client.slashCommands.get(command.name)
          cmdPush(ctg, subCmd, command)
        })
      })
      .catch((err) => {
        console.error('Error fetching commands:', err)
      })

    const clientCmdL = t('command:help.clientCommands', { lng })
    const adminCmdL = t('command:help.adminCommands', { lng })
    const othersCmdL = t('command:help.otherCommands', { lng })
    const cityCmdL = t('command:help.cityCommands', { lng })
    const dvcCmdL = t('command:help.dvcCommands', { lng })
    const xpCmdL = t('command:help.xpCommands', { lng })
    const musicCmdL = t('command:help.musicCommands', { lng })
    const noAvailableL = t('command:help.noAvailable', { lng })

    const embeds = [
      new EmbedBuilder()
        .setTitle(clientCmdL)
        .addFields(clientCmd)
        .setTimestamp()
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle(adminCmdL)
        .addFields(adminCmd)
        .setTimestamp()
        .setColor(Colors.DarkGreen),

        new EmbedBuilder()
        .setTitle(musicCmdL)
        .addFields(musicCmd)
        .setTimestamp()
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle(cityCmdL)
        .addFields(
          cityCmd.length !== 0
            ? cityCmd
            : {
                name: '⠀',
                value: noAvailableL
              }
        )
        .setTimestamp()
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle(dvcCmdL)
        .addFields(
          dvcCmd.length !== 0
            ? dvcCmd
            : {
                name: '⠀',
                value: noAvailableL
              }
        )
        .setTimestamp()
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle(xpCmdL)
        .addFields(
          xpCmd.length !== 0
            ? xpCmd
            : {
                name: '⠀',
                value: noAvailableL
              }
        )
        .setTimestamp()
        .setColor(Colors.DarkGreen),

      new EmbedBuilder()
        .setTitle(othersCmdL)
        .addFields(
          othersCmd.length !== 0
            ? othersCmd
            : {
                name: '⠀',
                value: noAvailableL
              }
        )
        .setTimestamp()
        .setColor(Colors.DarkGreen)
    ]

    await PaginationEmbed(interaction, embeds)
  }
}

module.exports = Help