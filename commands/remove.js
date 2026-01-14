module.exports = {
  name: 'remove',
  description: 'Remove a verified user (admin only)',
  execute: async (client, message, args, db, adminIds) => {
    // Check if the author is an admin
    if (!adminIds.includes(message.author.id)) {
      message.reply('❌ - You are not obligated to execute this command.');
      return;
    }

    const targetId = args[0];
    if (!targetId) {
      message.reply('⚠️ Please provide the Discord ID of the user to remove. Example: `*remove 123456789012345678`');
      return;
    }

    // Remove user from database
    db.run('DELETE FROM users WHERE discord_id = ?', [targetId], function(err) {
      if (err) {
        console.error('Database error while removing user:', err);
        message.reply('❌ Failed to remove the user due to a database error.');
      } else if (this.changes === 0) {
        message.reply('⚠️ No user found with that Discord ID.');
      } else {
        message.reply(`✅ Successfully removed user with Discord ID: ${targetId}`);
      }
    });
  }
};
