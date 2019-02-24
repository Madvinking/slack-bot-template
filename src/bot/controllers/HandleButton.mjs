import { getLogger } from '../../config/index';

const logger = getLogger(__filename);

export function HandleButton({ openDialog, postMessage, db, slackToken }) {
  return async function({
    trigger_id,
    actions: [{ value = null, block_id: button }],
    team: { id: team },
    user: { id: user },
    channel: { id: channel }
  }) {
    try {
    } catch (err) {
      logger.error(err);
      postMessage({
        channel,
        text: err.message
      });
    }
  };
}
