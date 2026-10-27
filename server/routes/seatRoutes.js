const express = require('express');
const router = express.Router();
const { getSeatsByShowId } = require('../controllers/seatController');

router.get('/show/:showId', getSeatsByShowId);

module.exports = router;
