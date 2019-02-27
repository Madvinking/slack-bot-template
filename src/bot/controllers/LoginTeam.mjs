import { getLogger } from '../../config/index';
import { tokenGenerator } from '../../utils/index';

const logger = getLogger(__filename);

export function LoginTeam() {
  const { INSTALL_LINK: installLink, LOCAL_DOMAIN: localDomain } = process.env;

  return async function(req, res) {
    const state = tokenGenerator.get();
    const url = `${installLink}&state=${state}&redirect_uri=${localDomain}/oauth`;
    logger.info('new login started... url: ', url);
    res.redirect(url);
  };
}
