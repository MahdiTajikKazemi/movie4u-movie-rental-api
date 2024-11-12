const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function() {
    mongoose.connect('mongodb://localhost/movie4u')
        .then(() => logger.log('info', 'Connected to the MongoDB...'))
}