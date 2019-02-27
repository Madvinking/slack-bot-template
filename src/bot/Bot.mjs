import { ListenToAPI } from './routes';
import { WebClient } from '@slack/client';
import { getLogger } from '../config/index';
import { Controllers } from './controllers';

const logger = getLogger(__filename);
export class Bot {
  constructor({ name, port, slackToken, slackSecret, db }) {
    this.name = name;
    //webClient is for sending users messages data and etc...
    const {
      chat: { postMessage },
      dialog: { open: openDialog },
      oauth: { access: getAccessToken }
    } = new WebClient(slackToken);

    // initiation controllers with the response function
    logger.info('initiation controllers');
    const controllers = Controllers({
      db,
      slackToken,
      openDialog,
      postMessage,
      getAccessToken
    });

    logger.info('initiation routes');
    this.routes = ListenToAPI({
      port,
      slackSecret,
      controllers
    });
  }
}
