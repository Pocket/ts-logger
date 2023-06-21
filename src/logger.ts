import winston, { Logger } from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3, // optional level for http req & resp logging
  graphql: 4, // optional level for graphql req & resp logging
  debug: 5,
};

const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const isLocal = env === 'local';
const isTest = env === 'test';
const level = () => {
  // by default, dev & local envs run at debug, prod runs at http
  return isDevelopment || isLocal ? 'debug' : 'http';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

// write logs to file, for local development
const fileLoggingTransports = [
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

const transports = [
  // for local and test envs, log to files
  // otherwise, log to the console
  ...(isLocal || isTest
    ? fileLoggingTransports
    : [new winston.transports.Console()]),
];

export function setLogger(metadata: object = {}): Logger {
  const releaseSha: string = process.env.RELEASE_SHA || null;
  const allMetadata: object = {
    ...metadata,
    releaseSha,
  };

  const baseLogger = winston.createLogger({
    level: level(),
    levels,
    format,
    defaultMeta: allMetadata,
    transports,
  });

  return baseLogger;
}
