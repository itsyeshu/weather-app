const express = require("express");
const router = express.Router();

const DEFAULT = require("./constants");
const apiRoutes = require("./api/router");

// API
router.use("/", apiRoutes);

module.exports = router;