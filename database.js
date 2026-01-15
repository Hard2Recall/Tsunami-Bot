const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('❌Could not connect to database', err);
  } else {
    console.log('✅Connected to SQLite database');
  }
});

// Create table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    discord_id TEXT PRIMARY KEY,
    minecraft_uuid TEXT,
    minecraft_ign TEXT,
    role_id TEXT,
    color_hex TEXT,
    verified_at INTEGER
  )`,
  (err) => {
    if (err) {
      console.error('❌Failed to create users table', err);
    } else {
      console.log('✅Users table is ready');
    }
  }
);

module.exports = db;
