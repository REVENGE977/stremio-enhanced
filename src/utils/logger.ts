import { createLogger, format, transports } from 'winston';

const Logger = createLogger({
    format: format.combine(
        format(info => {
            info.level = info.level.toUpperCase()
            return info;
        })(),
        format.colorize(),
        format.printf((info) => {
            return `${info.level}: ${info.message}`;
        })
    ),
    transports: [new transports.Console()]
});

export default Logger;