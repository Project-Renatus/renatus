const Component = require("../../../Structures/Classes/BaseComponent");
const { t } = require("i18next");

class But1 extends Component {
  constructor(client) {
    super(client, {
      id: "but1",
    });
  }
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async execute(interaction, client, lng) {
    await interaction.reply({ content: t("command:ping.reply", { lng }) });
  }
}

module.exports = But1;
