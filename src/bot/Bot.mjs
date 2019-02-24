import { ListenToAPI } from './routes';
import { WebClient } from '@slack/client';
import { getLogger, DB } from '../config/index';
import { Controllers } from './controllers';

const logger = getLogger(__filename);
export class Bot {
  constructor({ name, port, slackToken, slackSecret, dbConfig }) {
    this.name = name;
    const db = DB(dbConfig);

    //webClient is for sending users messages data and etc...
    const {
      chat: { postMessage },
      dialog: { open: openDialog }
    } = new WebClient(slackToken);

    // initiation controllers with the response function
    logger.info('initiation controllers');
    const controllers = Controllers({
      postMessage,
      db,
      openDialog,
      slackToken
    });

    logger.info('initiation routes');
    this.routes = ListenToAPI({
      port,
      slackSecret,
      controllers
    });
  }
}
