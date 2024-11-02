const genres = require('./routes/genres');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);

console.log(process.env.PORT)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

mongoose.connect('mongodb://localhost/movie4u')
    .then(() => console.log('Connected to the mongodb...'))
    .catch((error) => console.log('Can not connect to the mongodb...', error));