import { createPool } from 'mysql';
import SQL from 'sql-template-strings';

let pool;

// convert mysql pool and query callback to promise
const query = function makeQuery(sql) {
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
};

const getFactory = function(tableName, translator) {
  return async function getById(id) {
    const sql = SQL`SELECT * from `
      .append(tableName)
      .append(SQL` where id = ${id}`);

    const [user] = await query(sql);
    return translator(user);
  };
};

const saveUserFactory = function(tableName) {
  return function saveUser({
    id,
    access_token,
    scopes: scopesObj,
    team,
    user
  }) {
    const scopes = JSON.stringify(scopesObj);

    const sql = SQL`INSERT into `
      .append(tableName)
      .append(SQL` (id, access_token, scopes, team, user)`)
      .append(SQL`VALUES (${id}, ${access_token}, ${scopes}, ${team}, ${user})`)
      .append(
        SQL`ON DUPLICATE KEY UPDATE id=${id}, access_token=${access_token}, scopes=${scopes}, team=${team}, user=${user}`
      );

    return query(sql);
  };
};

const saveTeamFactory = function(tableName) {
  return function saveTeam({ id, createdBy, name, url, token, bot: botObj }) {
    const bot = JSON.stringify(botObj);
    const sql = SQL`INSERT into `
      .append(tableName)
      .append(SQL` (id, createdBy, name, url, token, bot)`)
      .append(
        SQL`VALUES (${id}, ${createdBy}, ${name}, ${url}, ${token}, ${bot})`
      )
      .append(
        SQL`ON DUPLICATE KEY UPDATE createdBy = ${createdBy}, name = ${name}, url = ${url}, token = ${token}, bot = ${bot}`
      );
    return query(sql);
  };
};

const saveAccountFactory = function(tableName) {
  return function saveAccount({ team, id, alias, user }) {
    const sql = SQL`INSERT into `
      .append(tableName)
      .append(SQL` (team, id, alias, user)`)
      .append(SQL`VALUES (${team}, ${id}, ${alias}, ${user})`)
      .append(
        SQL`ON DUPLICATE KEY UPDATE team = ${team}, id = ${id}, alias = ${alias}, user = ${user}`
      );
    return query(sql);
  };
};

const saveChannelFactory = function(tableName) {
  return function saveChannel({ id, ...rest }) {
    const stringifiedJson = JSON.stringify(rest);
    const sql = SQL`INSERT into `
      .append(tableName)
      .append(SQL` (id, json)`)
      .append(SQL`VALUES (${id}, ${stringifiedJson})`)
      .append(SQL`ON DUPLICATE KEY UPDATE json=${stringifiedJson}`);
    return query(sql);
  };
};

const fetchAllFactory = function(tableName, translator) {
  return async function fetchAll() {
    const sql = SQL`SELECT * from `.append(tableName);
    const { rows } = await query(sql);
    const translatedData = rows.map(translator);
    return translatedData;
  };
};

const dbToUserJson = function({ scopes, ...rest }) {
  return {
    ...rest,
    ...(scopes ? { scopes: JSON.parse(scopes) } : {}) //if host exist it will add it
  };
};

const dbToTeamJson = function({ bot, ...rest }) {
  return {
    ...rest,
    ...(bot ? { bot: JSON.parse(bot) } : {}) //if host exist it will add it
  };
};

const dbToChannelJson = function({ id, json }) {
  return {
    id,
    ...JSON.parse(json)
  };
};

export function DB({ host, connectionLimit = 10, ...rest }) {
  if (!host) throw new Error('Need to provide MySQL connection information.');

  pool = createPool({
    host,
    connectionLimit,
    ...rest
  });

  return {
    teams: {
      get: getFactory('team', dbToTeamJson),
      save: saveTeamFactory('team'),
      all: fetchAllFactory('team', dbToTeamJson)
    },
    channels: {
      get: getFactory('channel', dbToChannelJson),
      save: saveChannelFactory('channel'),
      all: fetchAllFactory('channel', dbToChannelJson)
    },
    users: {
      get: getFactory('user', dbToUserJson),
      save: saveUserFactory('user'),
      all: fetchAllFactory('user', dbToUserJson)
    },
    account: {
      get: getFactory('account', dbToUserJson),
      save: saveAccountFactory('account'),
      all: fetchAllFactory('account', dbToUserJson)
    }
  };
}
