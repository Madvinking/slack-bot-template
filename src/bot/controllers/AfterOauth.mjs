import { getLogger } from '../../config/index';

const logger = getLogger(__filename);

export function AfterOauth({ db }) {
  const { SUCCESS_URL: successUrl, FAILED_URL: failedUrl } = process.env;

  return async function(req, res) {
    try {
      res.redirect(successUrl);
    } catch (err) {
      logger.error(err);
      res.redirect(failedUrl);
    }
  };
}
