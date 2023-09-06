const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason given";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server!");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't kick the server owner!");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the traget user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest Role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't kick that member because they have the same/higher role than you!"
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Unable to kick the member because they have the same/higher role as the bot!"
      );
      return;
    }

    // Kick the targetUser
    try {
      await targetUser.kick(reason);
      await interaction.editReply(
        `User ${targetUser} was kicked\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
    }
  },

  name: "kick",
  description: "kicks a member from the server.",
  options: [
    {
      name: "target-user",
      description: "The user thats going to be kicked.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "The reason the user is being kicked.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionsBitField.KickMembers],
};
