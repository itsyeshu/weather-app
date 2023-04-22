const express = require('express');
const router = express.Router();

const DEFAULT = require('./constants');
const weatherController = require(`${DEFAULT.CONTROLLER_DIR}/weather`);

router.get('/', weatherController.weatherController);

module.exports = router;