const LOG_LEVELS = { debug: 0, log: 1, warn: 2, error: 3 } as const;
type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel: LogLevel = __DEV__ ? 'debug' : 'error';

const timestamp = () => new Date().toISOString();

const shouldLog = (level: LogLevel) => LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog('debug')) console.debug(`[${timestamp()}] [DEBUG]`, message, ...args);
  },
  log: (message: string, ...args: unknown[]) => {
    if (shouldLog('log')) console.log(`[${timestamp()}] [INFO]`, message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog('warn')) console.warn(`[${timestamp()}] [WARN]`, message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    if (shouldLog('error')) console.error(`[${timestamp()}] [ERROR]`, message, ...args);
  },
};
