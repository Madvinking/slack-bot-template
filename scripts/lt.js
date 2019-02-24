require('dotenv').config();
const { promisify } = require('util');
const localtunnel = promisify(require('localtunnel'));
const { PORT: port, LOCAL_SUB_DOMAIN: subdomain } = process.env;

async function time(time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time * 1000);
  });
}

async function init() {
  async function closeTunnel() {
    try {
      await time(5);
      console.log('restarting tunnel');
      init();
    } catch (err) {
      console.log('TCL: }catch -> err', err);
    }
  }

  try {
    const tunnel = await localtunnel(port, { subdomain });
    const { url } = tunnel;
    if (!url.includes(subdomain)) await closeTunnel();
    console.log(`tunnel opend host: ${url}`);
    tunnel.on('close', closeTunnel);
    tunnel.on('error', closeTunnel);
  } catch (err) {
    console.log('err', err);
    await closeTunnel();
  }
}

init();
