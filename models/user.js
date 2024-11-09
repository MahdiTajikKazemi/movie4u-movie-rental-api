const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 50,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).max(50).required()
    });

    return schema.validate(user);
}


exports.User = User;
exports.validate = validateUser;