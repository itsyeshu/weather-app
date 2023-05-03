const express = require('express');
const router = express.Router();

const DEFAULT = require('./constants');
const weatherController = require(`${DEFAULT.CONTROLLER_DIR}/weather`);

// Weather routes
router.get('/', weatherController.weatherController);
router.get('/img', weatherController.dynamicWeatherOGImageController);

module.exports = router;