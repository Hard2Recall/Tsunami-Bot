module.exports = {
  name: 'ign',
  description: 'Get the Minecraft username of a user',
  execute: async (client, message, args, db) => {
    // Get mentioned user
    const mentionedUser = message.mentions.users.first();
    
    if (!mentionedUser) {
      message.reply('⚠️ Please mention a user. Example: `*ign @UserName`');
      return;
    }

    const userId = mentionedUser.id;

    db.get('SELECT minecraft_ign FROM users WHERE discord_id = ?', [userId], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        message.reply('❌ An error occurred while retrieving the username.');
        return;
      }

      if (!row) {
        message.reply(`❌ - Can't retrieve this users Minecraft username, since they have not verified`);
        return;
      }

      message.reply(`**${mentionedUser.username}**'s Minecraft username is: **${row.minecraft_ign}**`);
    });
  }
};
