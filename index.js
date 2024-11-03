const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

mongoose.connect('mongodb://localhost/movie4u')
    .then(() => console.log('Connected to the mongodb...'))
    .catch((error) => console.log('Can not connect to the mongodb...', error));