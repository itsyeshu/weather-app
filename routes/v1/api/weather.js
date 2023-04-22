const express = require("express");
const router = express.Router();

const DEFAULT = require("../constants");
const weatherAPIController = require(DEFAULT.API_CONTROLLER_DIR + "/weather");

router.get('/', weatherAPIController.weatherAPIController);

module.exports = router;