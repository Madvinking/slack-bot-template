require('dotenv').config();

import { getLogger, DB } from './config/index';
import { Bot } from './bot/Bot';
const logger = getLogger(__filename);

async function init() {
  const {
    PORT: port,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PORT,
    MYSQL_DATABASE,
    BOT_NAME: name,
    MYSQL_ROOT_PASSWORD,
    SLACK_CLIENT_SIGNING_SECRET: slackSecret,
    SLACK_BOT_USER_OAUTH_ACCESS_TOKEN: slackToken
  } = process.env;
  logger.info(`start bot ${name}`);

  const dbConfig = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    database: MYSQL_DATABASE,
    password: MYSQL_ROOT_PASSWORD
  };

  const db = await DB(dbConfig);
  new Bot({ name, port, slackToken, slackSecret, db });
}

init();
