import pino, { DestinationStream, LoggerOptions } from 'pino';

export const createLogger = (name: string, opts?: DestinationStream | LoggerOptions<never> | undefined) => {
    return pino({
        transport: {
            target: 'pino-pretty'
        },
        name,
        level: process.env.LOG_LEVEL || 'info',
        ...opts
    });
}