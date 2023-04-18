const express = require("express");
const router = express.Router();

router.get('/current', (req, res) => {
    res.send("Current weather data");
})

router.get('/forecast', (req, res) => {
    res.send("Current weather data");
})

module.exports = router;