import { commandList } from '../commands/index';
import { getLogger } from '../../config/index';
import { parseMessage } from '../../utils/index';

const logger = getLogger(__filename);
/**
 * handledMessage -
 * @param postMessage function to return the answer to
 *
 */
export function HandledMessage({ postMessage, db }) {
  return async function({ text, channel, user = null, subtype }) {
    //filter message return from the bot
    try {
      // ignore messages that came from bots (including self)
      if (subtype === 'bot_message' || !user) return;

      const [name, instructions] = parseMessage(text);
      const command = commandList.find(c => c.name === name);

      if (!command) throw Error(`no such command ${name}`);

      const response = await command.invoke({
        instructions,
        channel,
        user,
        db
      });
      postMessage(response);
    } catch (err) {
      logger.error(err.message);
      postMessage({ text: `error - ${err.message}`, channel });
    }
  };
}
