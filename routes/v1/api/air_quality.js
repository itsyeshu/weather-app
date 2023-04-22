const express = require("express");
const router = express.Router();

const DEFAULT = require("../constants");
const aqiAPIController = require(DEFAULT.API_CONTROLLER_DIR + "/air_quality");

router.get('/', aqiAPIController.aqiController);

module.exports = router;