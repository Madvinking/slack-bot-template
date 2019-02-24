require('dotenv').config();

import { getLogger } from './config/index';
import { Bot } from './bot/Bot';

const logger = getLogger(__filename);

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
new Bot({ name, port, slackToken, slackSecret, dbConfig });
