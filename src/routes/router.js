const express = require('express');
const csv = require('./csv');

const router = express.Router();

router.use('/', csv);

module.exports = router;
