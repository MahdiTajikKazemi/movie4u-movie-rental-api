const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        phone: Joi.string().required().min(5).max(50),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = Customer;