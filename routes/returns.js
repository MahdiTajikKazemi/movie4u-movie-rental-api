const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('CustomerId was not provided.');
    
    return res.sendStatus(401);
});

module.exports = router;