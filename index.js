import express from 'express';
import path from 'path';
import api from './api/index.js';
import db from './db.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use('/', api);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'web'), { extensions: ['html', 'htm'], index: 'index.html' }));

process.on('SIGINT', async () => {
  try {
    await db.end();
  } catch(e) {
    console.error('Error while closing database connections.', e);
  }
  process.exit(0);
});

const migrate = async () => {
  console.log('warn', 'Running migration script');
  try {
    await db.upgrade('./db', 'db_migrate');
  } catch(e) {
    console.log('error in migrate', e);
    await db.end();
    console.log('Shutting down with error');
    process.exit(1);
  }
};

app.listen(port, async () => {
  await migrate();
  await db.load();

  console.log(`Server running on port ${port}`);
});

