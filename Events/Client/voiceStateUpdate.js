const Event = require('../../Structures/Classes/BaseEvent')
const { Events, PermissionFlagsBits } = require('discord.js')
const { DynamicChannel } = require('../../Schemas')

class VoiceStateUpdate extends Event {
  constructor(client) {
    super(client, {
      name: Events.VoiceStateUpdate
    })
  }

  async execute(oldState, newState) {
    // Ignore bots or cases where there's no channel change
    if (newState.member.user.bot) return

    try {
      // Check if the user joined the "Join to Create" channel
      const dynamicChannel = await DynamicChannel.findOne({
        guildId: newState.guild.id,
        userId: 'system'
      })

      if (dynamicChannel && newState.channelId === dynamicChannel.channelId) {
        // Create a new personal voice channel for the user
        const newChannel = await newState.guild.channels.create({
          name: `${newState.member.displayName}'s channel`,
          type: 2,
          parent: newState.channel.parentId,
          permissionOverwrites: [
            {
              id: newState.member.id,
              allow: [
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.ManageChannels
              ]
            }
          ]
        })

        await newState.setChannel(newChannel)

        // Save the new channel in the database
        await new DynamicChannel({
          userId: newState.member.id,
          channelId: newChannel.id,
          guildId: newState.guild.id
        }).save()
      }

      // Delete the personal voice channel if it becomes empty
      if (oldState.channelId && oldState.channel.members.size === 0) {
        const personalChannel = await DynamicChannel.findOne({
          channelId: oldState.channelId,
          userId: { $ne: 'system' }
        })
        if (personalChannel) {
          await oldState.channel.delete()
          await DynamicChannel.deleteOne({ channelId: oldState.channelId })
        }
      }
    } catch (error) {
      console.error(`Could not handle voice state update: ${error}`)
    }
  }
}

module.exports = VoiceStateUpdate
