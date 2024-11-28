const Command = require('../../../Structures/Classes/BaseCommand');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { UserWorkData, UserXPData } = require('../../../Schemas/index.js');
const { t } = require('i18next');

const ongoingGames = new Map();

class RPS extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Rock-Paper-Scissors game commands.')
        .setDescriptionLocalizations({
          'zh-TW': '玩石頭剪刀布遊戲命令。',
          'en-US': 'Rock-Paper-Scissors game commands.',
        })
        .addSubcommand(subcommand =>
          subcommand
            .setName('bot')
            .setDescription('Play Rock-Paper-Scissors against the bot.')
            .setDescriptionLocalizations({
              'zh-TW': '對抗機器人玩石頭剪刀布。',
              'en-US': 'Play Rock-Paper-Scissors against the bot.',
            })
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('invite')
            .setDescription('Invite another user to play RPS.')
            .setDescriptionLocalizations({
              'zh-TW': '邀請另一位用戶玩石頭剪刀布。',
              'en-US': 'Invite another user to play RPS.',
            })
            .addUserOption(option =>
              option.setName('opponent')
                .setDescription('Select an opponent to challenge.')
                .setDescriptionLocalizations({
                  'zh-TW': '選擇一個對手來挑戰。',
                  'en-US': 'Select an opponent to challenge.',
                })
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('accept')
            .setDescription('Accept an RPS game invitation.')
            .setDescriptionLocalizations({
              'zh-TW': '接受石頭剪刀布遊戲的邀請。',
              'en-US': 'Accept an RPS game invitation.',
            })
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('reject')
            .setDescription('Reject an RPS game invitation.')
            .setDescriptionLocalizations({
              'zh-TW': '拒絕石頭剪刀布遊戲的邀請。',
              'en-US': 'Reject an RPS game invitation.',
            })
        )
    })
  }

  async execute(interaction, client, lng) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (subcommand === 'bot') {
      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('rock').setLabel('Rock').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('paper').setLabel('Paper').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('scissors').setLabel('Scissors').setStyle(ButtonStyle.Primary)
        );

      await interaction.reply({
        content: t('command:rps.bot.prompt', { lng }),
        ephemeral: true,
        components: [buttons],
      });

      const filter = i => i.user.id === userId;
      const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 30000 });

      collector.on('collect', async i => {
        await i.deferUpdate();
        const userChoice = i.customId;
        const botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];

        let result;
        if (userChoice === botChoice) {
          result = 'draw';
        } else if (
          (userChoice === 'rock' && botChoice === 'scissors') ||
          (userChoice === 'paper' && botChoice === 'rock') ||
          (userChoice === 'scissors' && botChoice === 'paper')
        ) {
          result = 'win';
        } else {
          result = 'lose';
        }

        const resultDescriptions = {
          draw: t('command:rps.bot.embed.draw', { lng, choice: userChoice }),
          win: t('command:rps.bot.embed.win', { lng, userChoice, botChoice }),
          lose: t('command:rps.bot.embed.lose', { lng, userChoice, botChoice })
        };

        const embed = new EmbedBuilder()
          .setTitle(t('command:rps.bot.embed.title', { lng }))
          .setDescription(resultDescriptions[result])
          .setColor(result === 'win' ? 0x00FF00 : result === 'lose' ? 0xFF0000 : 0xFFFF00)
          .setThumbnail(interaction.user.displayAvatarURL())
          .setTimestamp()
          .addFields(
            { name: t('command:rps.embed.coins', { lng }), value: '+0', inline: true },
            { name: t('command:rps.embed.xp', { lng }), value: '+0', inline: true },
            { name: '\u200B', value: '\u200B' }
          )
          .setFooter({ text: t('command:rps.embed.footer', { lng, username: interaction.user.username }), iconURL: interaction.user.displayAvatarURL() });

        await interaction.followUp({ embeds: [embed], ephemeral: true });
        collector.stop();
      });
    }

    if (subcommand === 'invite') {
      const opponent = interaction.options.getUser('opponent');

      if (userId === opponent.id) {
        return interaction.reply({
          content: t('command:rps.selfChallenge', { lng }),
          ephemeral: true,
        });
      }

      if (ongoingGames.has(userId) || ongoingGames.has(opponent.id)) {
        return interaction.reply({
          content: t('command:rps.alreadyInGame', { lng }),
          ephemeral: true,
        });
      }

      ongoingGames.set(userId, { opponentId: opponent.id, from: userId });
      ongoingGames.set(opponent.id, { opponentId: userId, from: userId });

      return interaction.reply({
        content: t('command:rps.invitationSent', { lng, opponentTag: opponent.tag }),
        ephemeral: true,
      });
    }

    if (subcommand === 'accept') {
      if (!ongoingGames.has(userId)) {
        return interaction.reply({
          content: t('command:rps.noInvitation', { lng }),
          ephemeral: true,
        });
      }

      const { opponentId, from } = ongoingGames.get(userId);
      if (userId !== opponentId) {
        return interaction.reply({
          content: t('command:rps.notYourInvitation', { lng }),
          ephemeral: true,
        });
      }

      if (userId === opponentId) {
        ongoingGames.delete(userId);
        ongoingGames.delete(from);
      }

      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('rock').setLabel('Rock').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('paper').setLabel('Paper').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('scissors').setLabel('Scissors').setStyle(ButtonStyle.Primary)
        );

      await interaction.reply({
        content: t('command:rps.accepted', { lng, opponentTag: `<@${from}>` }),
        ephemeral: true,
        components: [buttons],
      });

      const filter = i => i.user.id === userId || i.user.id === opponentId;
      const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

      const choices = {};
      collector.on('collect', async i => {
        choices[i.user.id] = i.customId;
        await i.deferUpdate();

        if (choices[userId] && choices[opponentId]) {
          collector.stop();
        }
      });

      collector.on('end', async () => {
        ongoingGames.delete(userId);
        ongoingGames.delete(opponentId);

        const playerChoice = choices[userId];
        const opponentChoice = choices[opponentId];
        
        let winner, loser, winnerId, loserId;

        if (playerChoice === opponentChoice) {
          return interaction.followUp({
            content: t('command:rps.draw', { lng, choice: playerChoice }),
            ephemeral: true,
          });
        } else if (
          (playerChoice === 'rock' && opponentChoice === 'scissors') ||
          (playerChoice === 'paper' && opponentChoice === 'rock') ||
          (playerChoice === 'scissors' && opponentChoice === 'paper')
        ) {
          winner = interaction.member;
          loser = interaction.guild.members.cache.get(opponentId);
          winnerId = userId;
          loserId = opponentId;
        } else {
          winner = interaction.guild.members.cache.get(opponentId);
          loser = interaction.member;
          winnerId = opponentId;
          loserId = userId;
        }

        // Handle win/lose logic and update the database
        const userWorkDataWinner = await UserWorkData.findOne({ userId: winnerId });
        const userWorkDataLoser = await UserWorkData.findOne({ userId: loserId });

        if (userWorkDataWinner && userWorkDataLoser) {
          userWorkDataWinner.winStreak += 1;
          userWorkDataLoser.winStreak = 0;

          const xpGained = Math.min(250 + userWorkDataWinner.winStreak * 50, 500);
          await UserXPData.updateOne({ userId: winnerId }, { $inc: { xp: xpGained } });
          await UserXPData.updateOne({ userId: loserId }, { $inc: { xp: 100 } });

          await userWorkDataWinner.save();
          await userWorkDataLoser.save();

          const winnerXP = await UserXPData.findOne({ userId: winnerId });
          const loserXP = await UserXPData.findOne({ userId: loserId });

          const winnerEmbed = new EmbedBuilder()
            .setTitle(t('command:rps.embed.title', { lng }))
            .setDescription(t('command:rps.embed.winner', { lng, winnerTag: winner.displayName, loserTag: loser.displayName }))
            .setColor(0x00FF00)
            .setThumbnail(winner.user.displayAvatarURL())
            .setTimestamp()
            .addFields(
              { name: t('command:rps.embed.coins', { lng }), value: 'No change', inline: true },
              { name: t('command:rps.embed.xp', { lng }), value: `${xpGained} added`, inline: true },
              { name: t('command:rps.embed.totalXp', { lng }), value: winnerXP.xp.toString(), inline: true }
            )
            .setFooter({ text: t('command:rps.embed.footer', { lng, username: winner.user.username }), iconURL: winner.user.displayAvatarURL() });

          const loserEmbed = new EmbedBuilder()
            .setTitle(t('command:rps.embed.title', { lng }))
            .setDescription(t('command:rps.embed.loser', { lng, winnerTag: winner.displayName, loserTag: loser.displayName }))
            .setColor(0xFF0000)
            .setThumbnail(loser.user.displayAvatarURL())
            .setTimestamp()
            .addFields(
              { name: t('command:rps.embed.coins', { lng }), value: 'No change', inline: true },
              { name: t('command:rps.embed.xp', { lng }), value: '100 added', inline: true },
              { name: t('command:rps.embed.totalXp', { lng }), value: loserXP.xp.toString(), inline: true }
            )
            .setFooter({ text: t('command:rps.embed.footer', { lng, username: loser.user.username }), iconURL: loser.user.displayAvatarURL() });

          await interaction.followUp({ embeds: [winnerEmbed], ephemeral: true });
          await interaction.followUp({ embeds: [loserEmbed], ephemeral: true });
        }
      });
    }

    if (subcommand === 'reject') {
      if (!ongoingGames.has(userId)) {
        return interaction.reply({
          content: t('command:rps.noInvitation', { lng }),
          ephemeral: true,
        });
      }

      const { from } = ongoingGames.get(userId);
      ongoingGames.delete(userId);
      ongoingGames.delete(from);

      return interaction.reply({
        content: t('command:rps.rejected', { lng, opponentTag: `<@${from}>` }),
        ephemeral: true,
      });
    }
  }
}

module.exports = RPS;