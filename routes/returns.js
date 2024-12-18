const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middlewares/auth');
const Joi = require('joi');


router.post('/', auth, async (req, res) => {
    const { error } = validateReturn(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Renturn already processed.');

    rental.return();
    await rental.save();

    await Movie.findByIdAndUpdate({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
  
    return schema.validate(req);
}

module.exports = router;