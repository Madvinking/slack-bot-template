import { createPool } from 'mysql';
import SQL from 'sql-template-strings';
import { userTable, teamTable, channelTable } from './Tables';

let pool;
// convert mysql pool and query callback to promise
function query(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err); // not connected!
      connection.query(sql, (error, results) => {
        connection.release();
        if (error) reject(error);
        resolve(results);
      });
    });
  });
}

function getFactory(tableName) {
  return async function getById(id = null) {
    if (!id) throw Error('must provide id');
    const sql = SQL`SELECT * from `
      .append(tableName)
      .append(SQL` where id = ${id} `)
      .append(`LIMIT 1`);

    const [result] = await query(sql);
    if (!result) throw Error(`can't find ${id} in ${tableName}`);
    return result;
  };
}
function saveUserFactory(tableName) {
  return async function saveUser({
    id,
    name,
    scopes,
    team_id,
    real_name,
    access_token
  }) {
    const sql = SQL`INSERT into `
      .append(tableName)
      .append(SQL` (id, name, scopes, team_id, real_name, access_token)`)
      .append(
        SQL`VALUES (${id}, ${name}, ${scopes}, ${team_id}, ${real_name}, ${access_token})`
      )
      .append(
        SQL`ON DUPLICATE KEY UPDATE name=${name}, scopes=${scopes}, team_id=${team_id}, real_name=${real_name}, access_token=${access_token}`
      );
    const { affectedRows } = await query(sql);
    return Boolean(affectedRows);
  };
}

function saveTeamFactory(tableName) {
  return function saveTeam({
    id,
    name,
    domain,
    email_domain,
    enterprise_id,
    enterprise_name,
    createdBy,
    token
  }) {
    const sql = SQL`INSERT into `
      .append(tableName)
      .append(
        SQL` (id, name, domain, email_domain, enterprise_id, enterprise_name, createdBy, token)`
      )
      .append(
        SQL`VALUES (${id}, ${name}, ${domain}, ${email_domain}, ${enterprise_id}, ${enterprise_name}, ${createdBy}, ${token})`
      )
      .append(
        SQL`ON DUPLICATE KEY UPDATE name = ${name}, domain = ${domain}, email_domain = ${email_domain}, enterprise_id = ${enterprise_id}, enterprise_name = ${enterprise_name}, createdBy = ${createdBy}, token = ${token}`
      );
    return query(sql);
  };
}

function saveChannelFactory(tableName) {
  return function saveChannel({ id, name, creator, team_id }) {
    const sql = SQL`INSERT into `
      .append(tableName)
      .append(SQL` (id, name, creator, team_id)`)
      .append(SQL`VALUES (${id}, ${name}, ${creator}, ${team_id})`)
      .append(
        SQL`ON DUPLICATE KEY UPDATE name = ${name}, creator = ${creator}, team_id = ${team_id}`
      );
    return query(sql);
  };
}

function fetchAllFactory(tableName) {
  return function fetchAll() {
    const sql = SQL`SELECT * from `.append(tableName);
    return query(sql);
  };
}

export async function DB({
  host,
  connectionLimit = 10,
  database = null,
  ...rest
}) {
  if (!host) throw new Error('Need to provide MySQL connection information.');

  pool = await createPool({
    host,
    connectionLimit,
    ...(database ? { database } : {}),
    ...rest
  });
  if (database) await query(`CREATE DATABASE IF NOT EXISTS ${database}`);
  await query(userTable);
  await query(teamTable);
  await query(channelTable);

  return {
    teams: {
      get: getFactory('team'),
      save: saveTeamFactory('team'),
      all: fetchAllFactory('team')
    },
    channels: {
      get: getFactory('channel'),
      save: saveChannelFactory('channel'),
      all: fetchAllFactory('channel')
    },
    users: {
      get: getFactory('user'),
      save: saveUserFactory('user'),
      all: fetchAllFactory('user')
    }
  };
}
