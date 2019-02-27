require('dotenv').config();
const { promisify } = require('util');
const localtunnel = promisify(require('localtunnel'));
const { PORT: port, LOCAL_SUB_DOMAIN: subdomain } = process.env;

let interval = 5
let timeToWait = 2;


//each time a restart is called it will increase the time to wait by 1 sec
// after 5 times it will return to 2 second
async function time(time) {
  return await new Promise(resolve => {
    setTimeout(() =>  {
      timeToWait++;
      interval--;
      if (!interval) {
        interval = 5;
        timeToWait = 2;
      }
      resolve();
    }, time * 1000);
  });
}

async function closeTunnel() {
  try {
    console.log(`restarting tunnel in ${timeToWait} seconds`);
    const result = await time(timeToWait);
    return start(result);
  } catch (err) {
    console.log('closeTunnel - err: ', err);
  }
}


let singleListener = false;
async function start() {
  let tunnel;
  try {
    tunnel = await localtunnel(port, { subdomain });
    if (singleListener) {
      singleListener = false;
      tunnel.on('close', closeTunnel);
      tunnel.on('error', closeTunnel);
    }
    const { url } = tunnel;
    console.log(`tunnel opened host: ${url}`);
    if (!url.includes(subdomain)) throw Error(`not the right subdomain ${url}`);
  } catch (err) {
    console.log('err', err.message);
    if (tunnel) {
      tunnel.close();
    } else {
      closeTunnel();
    }

  }
}

start();
