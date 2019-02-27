import { HandleDialogSubmission } from './controllers/HandleDialogSubmission';
import { HandledMessage } from './controllers/HandledMessage';
import { HandleButton } from './controllers/HandleButton';
import { HandledError } from './controllers/HandledError';
import { HandleSlash } from './controllers/HandleSlash';
import { AfterOauth } from './controllers/AfterOauth';
import { LoginTeam } from './controllers/LoginTeam';
import { OauthTeam } from './controllers/OauthTeam';

export function Controllers(responseFunctions) {
  return {
    oauthTeam: OauthTeam(responseFunctions),
    loginTeam: LoginTeam(responseFunctions),
    afterOauth: AfterOauth(responseFunctions),
    handleSlash: HandleSlash(responseFunctions),
    handledError: HandledError(responseFunctions),
    handleButton: HandleButton(responseFunctions),
    handledMessage: HandledMessage(responseFunctions),
    handleDialogSubmission: HandleDialogSubmission(responseFunctions)
  };
}
