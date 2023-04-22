const express = require('express');
const router = express.Router();

const DEFAULT = require('./constants');
const searchController = require(`${DEFAULT.CONTROLLER_DIR}/search`);

router.get('/', searchController.searchController);

module.exports = router;