const logger = require('../startup/logger');

module.exports = function(error, req, res, next) {
    logger.log('error', error.message, error);

    res.status(500).send('Something went wrong');
}