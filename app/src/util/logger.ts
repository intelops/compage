import winston from 'winston';
import {DEVELOPMENT} from './constants';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || DEVELOPMENT;
    const isDevelopment = env === DEVELOPMENT;
    return isDevelopment ? 'debug' : 'info';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({all: true}),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

const transports = [
    new winston.transports.Console({
        // set the level here and logs at given level will be recorded.
        level: process.env.LOG_LEVEL || level(),
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({filename: 'logs/all.log'}),
];

const Logger = winston.createLogger({
    levels,
    format,
    transports,
});

export default Logger;