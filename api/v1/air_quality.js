const express = require("express");
const router = express.Router();

const DEFAULT = require("./constants");
const aqiController = require(DEFAULT.DIR + "/air_quality");
const searchController = require(DEFAULT.DIR + "/search");

router.get('/city', async (req, res) => {
    // Fetches air quality index of a city
    //
    // @param city_name: Name of the city
    // @param counter: Index of the city in the list of cities with the same name
    // @param start_date: Start date of the air quality index
    // @param end_date: End date of the air quality index
    // @param timezone: Timezone of the air quality index
    // @param lang: Language of the air quality index
    //
    // @return: Air quality index of the city

    const city_name = req.query.city || "";
    let counter = parseInt(req.query.counter);
    console.log(req.query.counter);
    if(req.query.counter === undefined || req.query.counter === "") counter = 1;
    const limit = Math.max(DEFAULT.DEFAULT_CITY_LIMIT, counter);
    const start_date = req.query.start_date || undefined;
    const end_date = req.query.end_date || undefined;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;


    if(city_name === "" || city_name === undefined){
        return res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            "message": "City name is required"
        });
    }
    if (isNaN(counter) || counter <= 0){
        return res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            "message": "Counter must be a positive integer"
        });
    }
    try{
        const {data : city_array, count} = await searchController.fetchCitiesFromName(city_name, limit, lang);
        if(count <= 0){
            res.status(404).send({
                "status": 404,
                "error": "City not found",
                "message": `City with name "${city_name}" does not exist`
            })
        }
        if(counter > count){
            res.status(206).send({
                "status": 206,
                "error": "City not found",
                "message": `City with name "${city_name}" does not exist at index ${counter}. Try a number between 1 and ${count}.`
            })
        }
        const city = city_array[counter-1];
        const air_quality = await aqiController.fetchCurrentAirQualityIndex(city.lat, city.lon, start_date, end_date, timezone, lang);
        res.status(200).send({
            "status": 200,
            "message": "Success",
            "city": city,
            "data": air_quality,
        });
    }catch(err) {
        console.log(err);
        res.status(500).send({
            "status": 500,
            "error": "Internal Server Error",
            "message": `${err.message}`
        })
    };
})

router.get('/latlon', async (req, res) => {

    // Fetches air quality index of a place at given latitude and longitude
    //
    // @param lat: Latitude of the place
    // @param lon: Longitude of the place
    // @param date: Start date of the air quality index
    // @param timezone: Timezone of the air quality index
    // @param lang: Language of the air quality index
    //
    // @return: Air quality index of the place

    const lat = req.query.lat;
    const lon = req.query.lon;
    if(lat === undefined || lon === undefined || lat === "" || lon === "" || isNaN(lat) || isNaN(lon)){
        return res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            "message": "Latitude and Longitude are required and must be numbers"
        });
    }
    const date = req.query.date || undefined;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    try{
        const air_quality = await aqiController.fetchCurrentAirQualityIndex(lat, lon, date, timezone, lang);
        res.status(200).send({
            "status": 200,
            "message": "Success",
            "data": air_quality,
        });
    }catch(err) {
        console.log(err);
        res.status(500).send({
            "status": 500,
            "error": "Internal Server Error",
            "message": `${err.message}`
        })
    };
})

module.exports = router;