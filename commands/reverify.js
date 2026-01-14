const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'reverify',
  description: 'Reverify your Minecraft account and correct UUID & Username, and update the color hex',
  execute: async (client, message, args, db, roleColors) => {
    if (!args[0]) {
      message.reply('⚠️ Please provide your Minecraft IGN. Example: `*reverify PlayerName`');
      return;
    }

    const ign = args[0];
    const discordId = message.author.id;

    // Check if user is verified
    db.get('SELECT * FROM users WHERE discord_id = ?', [discordId], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        message.reply('❌ An error occurred while checking your verification.');
        return;
      }

      if (!row) {
        message.reply('❌ You are not verified yet. Use `*verify` to verify first.');
        return;
      }

      try {
        const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
        if (!res.ok) {
          message.reply('❌ Invalid IGN. Please check your spelling.');
          return;
        }

        const data = await res.json();
        const uuid = data.id;
        const actualIgn = data.name; // Get the actual capitalization from Mojang API

        // Role check
        const member = message.guild.members.cache.get(discordId);
        if (!member) {
          message.reply('❌ Could not fetch your member data. Try again later.');
          return;
        }

        let colorHex = null;
        let roleId = null;

        for (const [id, color] of Object.entries(roleColors)) {
          if (member.roles.cache.has(id)) {
            roleId = id;
            colorHex = color;
            break;
          }
        }

        if (!colorHex) {
          message.reply('❌ - You are not obligated to execute this command.');
          return;
        }

        // Update existing user record
        db.run(
          'UPDATE users SET minecraft_uuid = ?, minecraft_ign = ?, role_id = ?, color_hex = ? WHERE discord_id = ?',
          [uuid, actualIgn, roleId, colorHex, discordId],
          function(err) {
            if (err) {
              console.error('Failed to update verification:', err);
              message.reply('❌ Failed to update your verification.');
            } else {
              message.reply(`✅ - You have been succesfully verified with username **${actualIgn}**`);
            }
          }
        );
      } catch (error) {
        console.error('Error fetching Mojang API:', error);
        message.reply('❌ An error occurred while reverifying. Try again later.');
      }
    });
  }
};
