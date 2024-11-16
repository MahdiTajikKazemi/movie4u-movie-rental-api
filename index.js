const logger = require('./startup/logger');
require('express-async-errors');
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.log('info', `Listening on port ${port}...`));

module.exports = server;