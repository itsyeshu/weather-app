const express = require("express");
const router = express.Router();

const apiRoutes = {
    search : require("./search"),
    weather : require("./weather"),
    air_quality : require("./air_quality"),
}

router.get('/', (req, res) => {
    res.send("API endpoint");
});

router.use('/search', apiRoutes.search);
router.use('/weather', apiRoutes.weather);
router.use('/air_quality', apiRoutes.air_quality);

module.exports = router;