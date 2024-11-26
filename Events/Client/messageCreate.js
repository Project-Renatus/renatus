const Event = require('../../Structures/Classes/BaseEvent');
const { Events } = require('discord.js');
const UserXPData = require('../../Schemas/Users/UserXPData');
const { Logger } = require('../../Structures/Functions/index');
const logger = new Logger();

class MessageCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.MessageCreate
    });
  }

  async execute(message) {
    if (message.webhookId) return;
    if (message.author.bot || !message.guild) return;

    const { author, guild, channel } = message;
    const userId = author.id;
    const guildId = guild.id;

    let userData = await UserXPData.findOne({ userId, guildId });

    if (!userData) {
      userData = await UserXPData.create({ userId, guildId, xp: 0, level: 1 });
    }

    const now = new Date();
    const timeDifference = now - userData.lastMessageTimestamp;
    const isSpamming = timeDifference < 10000;

    if (!isSpamming) {
      userData.dailyMessageCount += 1;

      // Calculate XP gain based on daily message count:
      let xpGain = Math.min(userData.dailyMessageCount, 10); // max 10 XP per message
      userData.xp += xpGain;

      // Check for level up
      const xpForNextLevel = 1000 * Math.pow(1.8, userData.level - 1);
      if (userData.xp >= xpForNextLevel) {
        userData.level += 1;
        userData.xp -= xpForNextLevel;

        // Send a congratulatory message to the channel
        channel.send(`🎉 Congratulations ${author}! You've leveled up to level ${userData.level}! 🎉`);
      }
    }

    userData.lastMessageTimestamp = now;
    await userData.save().catch(logger.error);
  }
}

module.exports = MessageCreate;