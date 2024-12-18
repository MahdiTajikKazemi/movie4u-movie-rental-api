const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']));
});

router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
    }, { new: true });

    if(!user) return res.status(404).send('The user with the given ID was not found.');
    
    res.send(_.pick(user, ['name', 'email', '_id']));
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

module.exports = router;