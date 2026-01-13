require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const db = require('./database');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const roleColors = require('./config/roles');
const adminIds = require('./config/admins');

const verifyCommand = require('./commands/verify');
const removeCommand = require('./commands/remove');

const prefix = '*';

// Express API (LOCAL)
const app = express();
const PORT = 3000;


//http://localhost:3000/users?token=API_TOKEN (Api token is in .env file)
app.get('/users', (req, res) => {
  const token = req.query.token;

  if (!token || token !== process.env.API_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  db.all(
    'SELECT minecraft_ign, minecraft_uuid, color_hex, discord_id FROM users',
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});

// Start local API server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Local API running at http://localhost:${PORT}/users?token=API_TOKEN`);
});

// Discord Bot Events
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  try {
    if (commandName === 'verify') {
      await verifyCommand.execute(client, message, args, db, roleColors);
    } else if (commandName === 'remove') {
      await removeCommand.execute(client, message, args, db, adminIds);
    }
  } catch (err) {
    console.error('Command error:', err);
    message.reply('An internal error occurred.');
  }
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('Failed to login bot:', err);
});
