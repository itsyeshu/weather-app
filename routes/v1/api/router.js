const express = require("express");
const DEFAULT = require("../constants");
const router = express.Router();

const apiRoutes = {
    search : require("./search"),
    weather : require("./weather"),
    air_quality : require("./air_quality"),
}

router.get('/', (req, res) => {
    res.send({
        "message" : "Welcome to the API" + DEFAULT.API_VERSION,
    });
});

router.use('/search', apiRoutes.search);
router.use('/weather', apiRoutes.weather);
router.use('/aqi', apiRoutes.air_quality);

module.exports = router;