const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { lowerCase, upperCase } = require('lodash');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        maxLength: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        minLength: 5,
        maxLength: 255,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024,
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(255).required(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;