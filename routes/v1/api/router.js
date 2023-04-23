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

router.use((req, res) => {
    res.status(404).send({
        "status" : "failed",
        "statusCode" : 404,
        "error" : "Resource not Found",
        "message" : "Resource not found at " + req.originalUrl.split("?")[0],
    });
});

module.exports = router;