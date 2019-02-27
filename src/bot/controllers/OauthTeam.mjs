import { getLogger } from '../../config/index';
import { tokenGenerator } from '../../utils/index';
const logger = getLogger(__filename);

export function OauthTeam({ getAccessToken, db }) {
  const {
    SUCCESS_URL: successUrl,
    LOCAL_DOMAIN: localDomain,
    FAILED_URL: failedUrl,
    SLACK_CLIENT_ID: client_id,
    SLACK_CLIENT_SECRET: client_secret
  } = process.env;

  const redirect_uri = `${localDomain}/oauth`;
  return async function(req, res) {
    try {
      const {
        req: { query: { code = null, state = null } = null } = null
      } = res;
      if (!state || !code)
        throw Error(`ouath team didn't received code or state`);
      if (tokenGenerator.get() !== state)
        throw Error(`login state didn't match`);

      const options = {
        code,
        client_id,
        redirect_uri,
        client_secret
      };

      const {
        access_token,
        scope,
        team_name,
        team_id: id
      } = await getAccessToken(options);
      const saved = await db.team.save({ access_token, scope, team_name, id });
      if (saved) {
        logger.info(`new team join bot ${id} - ${team_name}`);
        res.redirect(successUrl);
      } else throw Error(`error saving team ${id} - ${team_name}`);
    } catch (err) {
      logger.error(err);
      res.redirect(failedUrl);
    }
  };
}
