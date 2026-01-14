module.exports = {
  name: 'help',
  description: 'Show help menu with commands and functions',
  execute: async (client, message, args, db, roleColors, adminIds) => {
    const helpEmbed = {
      color: 0x7289DA,
      title: '📖 Tsunami Bot Commands',
      description: 'Here are the available commands:',
      fields: [
        {
          name: '✨ *verify [username]',
          value: 'Verify your Minecraft account. You need a role eligible for a color/logo.',
          inline: false
        },
        {
          name: '🔄 *reverify [username]',
          value: 'Reverify your Minecraft account and correct UUID & Username, and update the color hex.',
          inline: false
        },
        {
          name: '👤 *ign [discord ping]',
          value: 'Get the Minecraft username of a pinged user. Returns error if user is not verified.',
          inline: false
        },
        {
          name: '❌ *remove [discord id]',
          value: 'Remove a verified user from the database. (Admin only)',
          inline: false
        },
        {
          name: '📚 *help',
          value: 'Show this help menu with commands and functions.',
          inline: false
        }
      ],
      footer: {
        text: 'Use prefix * to execute commands'
      }
    };

    message.reply({ embeds: [helpEmbed] });
  }
};
