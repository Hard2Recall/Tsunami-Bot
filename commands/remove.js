module.exports = {
  name: 'remove',
  description: 'Remove a verified user (admin only)',
  execute: async (client, message, args, db, adminIds) => {
    if (!adminIds.includes(message.author.id)) return;

    const targetId = args[0];
    if (!targetId) {
      message.reply('Please provide the Discord ID of the user to remove. Example: *remove 123456789012345678');
      return;
    }

    db.run('DELETE FROM users WHERE discord_id = ?', [targetId], function(err) {
      if (err) {
        console.error(err);
        message.reply('Failed to remove the user.');
      } else if (this.changes === 0) {
        message.reply('No user found with that Discord ID.');
      } else {
        message.reply(`Successfully removed user with Discord ID: ${targetId}`);
      }
    });
  }
};
