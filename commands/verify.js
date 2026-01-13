const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'verify',
  description: 'Verify a user with Minecraft IGN',
  execute: async (client, message, args, db, roleColors) => {
    if (!args[0]) {
      message.reply('⚠️ Please provide your Minecraft IGN. Example: `*verify PlayerName`');
      return;
    }

    const ign = args[0];
    const discordId = message.author.id;

    // Check if already verified
    db.get('SELECT * FROM users WHERE discord_id = ?', [discordId], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        message.reply('❌ An error occurred while checking your verification.');
        return;
      }

      if (row) {
        message.reply('✅ You are already verified!');
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
          message.reply('⚠️ You do not have a role eligible for a color/logo.');
          return;
        }

        const timestamp = Date.now();

        db.run(
          'INSERT INTO users (discord_id, minecraft_uuid, minecraft_ign, role_id, color_hex, verified_at) VALUES (?, ?, ?, ?, ?, ?)',
          [discordId, uuid, ign, roleId, colorHex, timestamp],
          function(err) {
            if (err) {
              console.error('Failed to save verification:', err);
              message.reply('❌ Failed to save your verification.');
            } else {
              message.reply(`✅ Successfully verified **${ign}**!`);
            }
          }
        );
      } catch (error) {
        console.error('Error fetching Mojang API:', error);
        message.reply('❌ An error occurred while verifying. Try again later.');
      }
    });
  }
};
