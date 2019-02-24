import { HandleDialogSubmission } from './controllers/HandleDialogSubmission';
import { AddNewWorkspace } from './controllers/AddNewWorkspace';
import { HandledMessage } from './controllers/HandledMessage';
import { HandleButton } from './controllers/HandleButton';
import { HandledError } from './controllers/HandledError';
import { HandleSlash } from './controllers/HandleSlash';

export function Controllers(responseFunctions) {
  return {
    handleSlash: HandleSlash(responseFunctions),
    handledError: HandledError(responseFunctions),
    handleButton: HandleButton(responseFunctions),
    handledMessage: HandledMessage(responseFunctions),
    addNewWorkspace: AddNewWorkspace(responseFunctions),
    handleDialogSubmission: HandleDialogSubmission(responseFunctions)
  };
}
