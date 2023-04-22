const express = require("express");
const router = express.Router();

const routes = {
    search : require("./search"),
    weather : require("./weather"),
}

// Routes
router.use('/', routes.search);
router.use('/search', routes.weather);

module.exports = router;