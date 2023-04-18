const express = require("express");
const router = express.Router();

const DEFAULT = require("./constants");
const weatherController = require(DEFAULT.DIR + "/weather");

router.get('/city', async (req, res) => {
    const city_name = req.query.city || "";
    const counter = req.query.counter || 1;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    if(!city_name || city_name == ""){
        return res.status(400).send({
            "status": 400,
            "data" : null,
            "error": "Bad Request",
            "message": "City name is required"
        });
    }

    if(isNaN(counter) || counter < 1){
        return res.status(400).send({
            "status": 400,
            "data" : null,
            "error": "Bad Request",
            "message": "Counter must be a positive number"
        });
    }

    const weather_data = await weatherController.getCurrentWeatherData(city_name, counter, timezone, lang);
    return res.status(weather_data.status).send(weather_data);
})

router.get('/latlon', async (req, res) => {
    const lat = req.query.lat || "";
    const lon = req.query.lon || "";

    if(!lat || lat == "" || !lon || lon == "" || isNaN(lat) || isNaN(lon)){
        return res.status(400).send({
            "status": 400,
            "data" : null,
            "error": "Bad Request",
            "message": "Latitude and Longitude are required"
        });
    }
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    const weather_data = await weatherController.getCurrentWeatherDataByLatLon(lat, lon, timezone, lang);
    return res.status(weather_data.status).send(weather_data);
})

module.exports = router;