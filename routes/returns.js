const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    return res.sendStatus(401);
});

module.exports = router;