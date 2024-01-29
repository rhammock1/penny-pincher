import fs from 'fs';
import pg from 'pg';
const {Client, Pool} = pg;


const db_config = {
  connectionString: 'postgres://localhost:5432/budget',
  ssl: undefined,
};

const pool = new Pool(db_config);

const db_client = new Client(db_config);

db_client.on('connect', () => {
  console.log('info', 'Database Client Connected.');
});

const executeSQL = async (client, filename_or_sql) => {
  let sql = filename_or_sql;
  if(filename_or_sql.toLowerCase().endsWith('.sql')) {
    sql = fs.readFileSync(filename_or_sql).toString();
  }
  let result;
  try {
    result = await client.query(sql);
  } catch(e) {
    const msg = `SQL error: ${filename_or_sql} (Line: ${(sql.substring(0, e.position).match(/\n/g) || []).length}): ${e}.`
    console.error(msg);
    throw e;
  }
  return result;
}

const query = (text, params) => {
  return db_client.query(text, params);
};

const upgrade = async (dbRootPath, dbMigratePath) => {
  const client = new Client(db_config);
  await client.connect();
  try {
    const {rows: [postgresVersion]} = await client.query('SELECT version();');
    console.log('info', 'Postgres Version: ', postgresVersion?.version);
    await client.query('BEGIN;');
    const {rows: [latestVersion]} = await executeSQL(client, 'SELECT MAX(db_version) as latest from db_versions;');
    let version = latestVersion.latest || 0;
    const basePath = `${dbRootPath}/${dbMigratePath}`;
    console.log('warn', `Current database version: ${version}`);
    while(version < 900 && fs.existsSync(`${basePath}/${version + 1}.sql`)) {
      const startTime = new Date();
      console.log('warn', `Migrating the database to version: ${++version}`);
      await executeSQL(client, `${basePath}/${version}.sql`)
      console.log('warn', `Migrated to version: ${version}`);
      await executeSQL(client, `INSERT INTO db_versions (db_version) VALUES (${version})`);
      const runtime = new Date() - startTime;
      console.log('info', `Migration to ${version} took ${runtime / 1000} seconds`);
    }
    console.log('warn', 'Dropping existing triggers');
    await executeSQL(client, `${dbRootPath}/drop.sql`);

    await executeSQL(client, `${dbRootPath}/triggers.sql`);
    await executeSQL(client, `${dbRootPath}/functions.sql`);
    console.log('warn', 'Initialized triggers and functions.');

    await client.query('COMMIT');

    // for (const sqlFilename of fs.readdirSync(dbSetupPathFull)) {
    //   // eslint-disable-next-line no-await-in-loop
    //   await executeSql(client, `${dbSetupPathFull}/${sqlFilename}`);
    // }
  } catch(e) {
    console.error('error', 'Error while migrating the database: ', e);
    await client.query('ROLLBACK');
    throw new Error('Database Upgrade Failed.');
  } finally {
    await client.end();
  }
};

const file = async (filePath, params = {}) => {
  let sql = fs.readFileSync(`./${filePath}`).toString();
  const namedParams = [];
  const namedParam = (m) => {
    const p = m.slice(2, -1);
    const i = namedParams.indexOf(p);
      if(i >= 0) {
        return `$${i + 1}`;
      }
      namedParams.push(p);
      return `$${namedParams.length}`;
  };
  if(Object.keys(params)?.length) {
    sql = sql.replace(/\$\{[^{}]+\}/g, namedParam);
  }

  const args = [];
  if(namedParams.length) {
    for(const namedParam of namedParams) {
      args.push(params[namedParam]);
    }
  }
  const queryParams = {text: sql, values: args};
  return db_client
    .query(queryParams)
    .catch((e) => {
      console.log('error', e);
      throw e;
    });
};

const end = async () => {
  console.log('warn', 'Database connections shutting down.');
  await pool.end();
  await db_client.end();
  console.log('warn', 'Databse connections successfully shutdown');
}; 

const load = async () => {
  console.log('warn', 'Creating new database connection.');
  await db_client.connect();
}

export default {
  query,
  upgrade,
  file,
  end,
  load,
};
