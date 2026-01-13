const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  discord_id TEXT PRIMARY KEY,
  minecraft_uuid TEXT,
  minecraft_ign TEXT,
  role_id TEXT,
  color_hex TEXT,
  verified_at INTEGER
)`);

module.exports = db;
