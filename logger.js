const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './log/movie4u_errors.log', level: 'error' }),
        new winston.transports.MongoDB({ db: 'mongodb://localhost/movie4u', level: 'error' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './log/movie4u_exceptions.log', level: 'error' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: './log/movie4u_rejections.log' })
    ]
})

if (process.env.NODE_ENV !== 'production')
    logger.add(new winston.transports.Console({ format: winston.format.json() }));

module.exports = logger;