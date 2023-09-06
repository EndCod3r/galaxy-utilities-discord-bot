module.exports = {
  name: "ping",
  description: "Pong!",
  // devOnly: Boolean
  // testOnly: Boolean
  // options: Obejct[],
  // deleted: Boolean,

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};
