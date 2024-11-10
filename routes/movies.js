const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('The movie does not exits');
    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre...');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre...');

    let movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('The movie you are trying to update does not exits');

    movie.set({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });
    await movie.save();

    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('The movie you are trying to delete does not exits');

    res.send(movie);
});

module.exports = router;