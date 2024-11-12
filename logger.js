const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'movie4u_logger.log', level: 'error' }),
        new winston.transports.MongoDB({ db: 'mongodb://localhost/movie4u', level: 'error' })
    ]
})

if (process.env.NODE_ENV !== 'production')
    logger.add(new winston.transports.Console({ format: winston.format.json() }));

module.exports = logger;