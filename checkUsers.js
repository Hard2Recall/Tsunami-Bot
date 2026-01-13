const db = require('./database');

db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(rows);
  db.close();
});
