/*
 logger factory:
   - create logger object to each component (usually files)
   - keep list of loggers each is a singleton by name
   - adding logzio transporting layer to the logger object
*/
import LogzioWinstonTransport from 'winston-logzio';
import { relative } from 'path';
import {
  transports as _transports,
  createLogger,
  format,
  config
} from 'winston';

const transports = [];
const loggers = new Map();
// create 2 transports console and logzio:
const consoleTransport = new _transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf(info => {
      return `${info.logger} - [${info.level}]: ${info.message}`;
    })
  )
});
transports.push(consoleTransport);

const logzioTransport = (function createLogzioTransport() {
  const {
    LOGZIO_LOG_TYPE: type,
    LOGZIO_TOKEN: token,
    LOGZIO_HOST: host
  } = process.env;

  if (!token) return;

  const options = {
    type,
    token,
    ...(host ? { host } : {}) //if host exist it will add it
  };

  return new LogzioWinstonTransport(options);
})();

if (logzioTransport) {
  transports.push(logzioTransport);
  // if error flush logzioTransport and exit
  process.on('uncaughtException', err => {
    getLogger('root').error('UncaughtException processing: %s', err);
    logzioTransport.flush(() => process.exit(1));
  });
}

const loggerDefault = {
  transports,
  level: 'info',
  exitOnError: true,
  levels: config.npm.levels,
  exceptionHandlers: transports
};

/**
 * getLogger:
 * if loggerName not exist in map will create a new logger and return it
 * if loggerName exist will return it from the map object
 * @param {String} loggerName
 */
export function getLogger(loggerName) {
  // make sure to remove the root path from the name of the logger
  const name = relative(__dirname, loggerName);

  // return logger if it exist in the object map
  if (loggers.has(name)) {
    return loggers.get(name);
  }

  const logger = createLogger({
    ...loggerDefault,
    // add logger name as field
    format: format(info => {
      info.logger = name;
      return info;
    })()
  });

  loggers.set(name, logger);
  return logger;
}
