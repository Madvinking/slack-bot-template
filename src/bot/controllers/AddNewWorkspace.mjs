// import { commandList } from '../commands/index';
import { getLogger } from '../../config/index';

const logger = getLogger(__filename);
/**
 * AddNewWorkspace -
 * @param postMessage function to return the answer to
 *
 */
export function AddNewWorkspace({ postMessage, db }) {
  return async function(req, res) {
    console.log('TCL: AddNewWorkspace -> req', req);
    console.log('TCL: AddNewWorkspace -> res', res);
  };
}
