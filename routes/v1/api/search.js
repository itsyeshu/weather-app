const express = require("express");
const router = express.Router();

const DEFAULT = require("../constants");
const searchAPIController = require(DEFAULT.API_CONTROLLER_DIR +"/search");

router.get('/', searchAPIController.searchAPIController);

module.exports = router;