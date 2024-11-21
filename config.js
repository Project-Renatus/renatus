const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  botToken: process.env.token,
  mongoUrl: process.env.mongoUrl,
  clientId: process.env.clientId,
  logChannel: process.env.logChannel,
  deploySlashOnReady: true,
  underDevelopment: true,
  developers: [
    {
      name: "Miyuki Yue",
      id: "847761781409447947",
    },
    {
      name: "Wolf Yua",
      id: "720186844540567583",
    },
  ],
  devGuilds: [
    {
      name: "idk",
      id: "862922438182567976",
    },
  ],
  betaTestGuilds: [],
  logWebhook: process.env.logWebhook,
};
