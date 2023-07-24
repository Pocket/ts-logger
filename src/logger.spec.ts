import { setLogger } from './logger';
import sinon from 'sinon';

const defaultEnvs = process.env;

describe('setLogger', () => {
  const logger = setLogger();
  const loggerInfoSpy = sinon.spy(logger, 'info');

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...defaultEnvs };
  });

  afterEach(() => {
    loggerInfoSpy.resetHistory();
    process.env = defaultEnvs;
  });

  it('Local environment defaults to debug level', async () => {
    process.env.NODE_ENV = 'local';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;

    const testLogger = setLogger();
    expect(testLogger.level).toBe('debug');
  });
  it('Local environment writes to files only', async () => {
    process.env.NODE_ENV = 'local';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;

    const testLogger = setLogger();
    expect(testLogger.transports.length).toEqual(2);
    expect(testLogger.transports[0].name).toBe('file');
    expect(testLogger.transports[0].filename).toBe('error.log');
    expect(testLogger.transports[1].name).toBe('file');
    expect(testLogger.transports[1].filename).toBe('all.log');
  });
  it('Test environment writes to files only', async () => {
    process.env.NODE_ENV = 'test';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;

    const testLogger = setLogger();
    expect(testLogger.transports.length).toEqual(2);
    expect(testLogger.transports[0].name).toBe('file');
    expect(testLogger.transports[0].filename).toBe('error.log');
    expect(testLogger.transports[1].name).toBe('file');
    expect(testLogger.transports[1].filename).toBe('all.log');
  });
  it('Dev environment defaults to debug level', async () => {
    process.env.NODE_ENV = 'development';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;

    const testLogger = setLogger();
    expect(testLogger.level).toBe('debug');
  });
  it('Dev environment does not write to file', async () => {
    process.env.NODE_ENV = 'development';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;

    const testLogger = setLogger();
    expect(testLogger.transports.length).toEqual(1);
    expect(testLogger.transports[0].name).toBe('console');
  });
  it('Non-dev and non-local defaults to http level', async () => {
    const testLogger = setLogger();
    expect(testLogger.level).toBe('info');
  });
  it('Non-dev and non-local do not write to file', async () => {
    process.env.NODE_ENV = 'production';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;

    const testLogger = setLogger();
    expect(testLogger.transports.length).toEqual(1);
    expect(testLogger.transports[0].name).toBe('console');
  });
  it('Can override log level', async () => {
    const testLogger = setLogger();
    expect(testLogger.level).toBe('info');
    testLogger.level = 'warn';
    expect(testLogger.level).toBe('warn');
  });
  it('Logger has release SHA when present, null otherwise', async () => {
    logger.info('test');
    expect(loggerInfoSpy.calledOnce).toBeTruthy;
    expect(logger.defaultMeta).toHaveProperty('releaseSha');
    expect(logger.defaultMeta.releaseSha).toBeNull();

    process.env.RELEASE_SHA = '12345678910';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const setLogger = require('./logger').setLogger;
    const testLogger = setLogger();
    testLogger.info('test');
    expect(testLogger.defaultMeta).toHaveProperty('releaseSha');
    expect(testLogger.defaultMeta.releaseSha).toBe('12345678910');
  });
  it('Cat additional default metadata', async () => {
    const moreMeta = {
      extra: 'fields',
    };
    const testLogger = setLogger(moreMeta);
    expect(loggerInfoSpy.calledOnce).toBeTruthy;
    expect(testLogger.defaultMeta).toHaveProperty('releaseSha');
    expect(testLogger.defaultMeta.releaseSha).toBeNull();
    expect(testLogger.defaultMeta).toHaveProperty('extra');
    expect(testLogger.defaultMeta.extra).toBe('fields');
  });
});
