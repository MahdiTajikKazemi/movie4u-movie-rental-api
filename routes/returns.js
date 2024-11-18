const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const auth = require('../middlewares/auth');


router.post('/', auth, async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('CustomerId was not provided.');
    if(!req.body.movieId) return res.status(400).send('MovieId was not provided.');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });
    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Renturn already processed.');

    res.status(200).send();
});

module.exports = router;