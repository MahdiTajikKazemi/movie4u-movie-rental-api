const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send('Invalid Customer.');

  const movie = await Movie.findById(req.body.movieId);
  if(!movie) return res.status(400).send('Invalid Movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  const rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await rental.save();
    await Movie.findByIdAndUpdate( { _id: movie._id }, { $inc: {numberInStock: -1} });

    await session.commitTransaction();

    res.send(rental);
  }
  catch(ex) {
    await session.abortTransaction();
    res.status(500).send('Something failed.');
  }
  finally {
    await session.endSession();
  }
});

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send('The rental with the given ID was not found.');
    
    res.send(rental);
});
module.exports = router;
