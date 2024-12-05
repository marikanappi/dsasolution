import sqlite from 'sqlite3';

const db = new sqlite.Database('DSA.sqlite', (err) => {
  if (err) throw err;
});

export default db;