const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const db = require('./database');

require('dotenv').config();


// Config
const roleColors = require('./config/roles');
const adminIds = require('./config/admins');

// Commands
const verifyCommand = require('./commands/verify');
const removeCommand = require('./commands/remove');

const prefix = '*';

// Express API
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// API endpoint
app.get('/users', (req, res) => {
  const token = req.query.token; // mod will call /users?token=YOUR_API_TOKEN

  // Check if token matches your secret
  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Return all verified Minecraft IGNs and their colors
  db.all('SELECT minecraft_ign, color_hex FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});


app.listen(PORT, () => console.log(`✅API server running at port ${PORT}`));

// Bot ready
client.once('ready', () => {
  console.log(`✅Logged in as ${client.user.tag}`);
});

// Command handling
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'verify') {
    verifyCommand.execute(client, message, args, db, roleColors);
  } else if (commandName === 'remove') {
    removeCommand.execute(client, message, args, db, adminIds);
  }
});

client.login(process.env.DISCORD_TOKEN);

app.get('/users', (req, res) => {
  if (req.query.token !== process.env.API_TOKEN) return res.status(403).json({ error: 'Forbidden' });
});