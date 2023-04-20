const express = require("express");
const router = express.Router();

const DEFAULT = require("./constants");
const weatherController = require(DEFAULT.DIR + "/weather");

router.get('/', async (req, res) => {
    const city_name = req.query.city || undefined;
    const counter = req.query.counter || 1;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    if(city_name == undefined){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "data" : {},
            "error": "Bad Request",
            "message": "City name is required"
        });
    }

    if(!city_name){
        const lat = req.query.lat || undefined;
        const lon = req.query.lon || undefined;

        if(!lat || lat == "" || !lon || lon == "" || isNaN(lat) || isNaN(lon)){
            return res.status(200).send({
                "status": "failed",
                "statusCode": 400,
                "data" : {},
                "error": "Bad Request",
                "message": "Latitude and Longitude are required"
            });
        }else{
        }
        const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
        const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

        const weather_data = await weatherController.getCurrentWeatherDataByLatLon(lat, lon, timezone, lang);
        if(weather_data.error){
            console.log("Error in api/v1/weather.js [65, 54] : ", weather_data.error);
            return res.send({
                "status": "failed",
                "statusCode": weather_data.statusCode,
                "error": weather_data.error,
                "message": weather_data.message,
                "data": weather_data.data
            });
        }
        return res.send(weather_data);
    }

    if(isNaN(counter) || counter < 1){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "data" : null,
            "error": "Bad Request",
            "message": "Counter must be a positive number"
        });
    }

    const weather_data = await weatherController.getCurrentWeatherData(city_name, counter, timezone, lang);
    if(weather_data.error){
        console.log("Error in api/v1/weather.js [35, 50] : ", weather_data.error);
        return res.send({
            "status": "failed",
            "statusCode": weather_data.statusCode,
            "error": weather_data.error,
            "message": weather_data.message,
            "data": weather_data.data
        });
    }
    return res.send(weather_data);
})

// router.get('/latlon', async (req, res) => {
//     const lat = req.query.lat || "";
//     const lon = req.query.lon || "";

//     if(!lat || lat == "" || !lon || lon == "" || isNaN(lat) || isNaN(lon)){
//         return res.status(200).send({
//             "status": "failed",
//             "statusCode": 400,
//             "data" : {},
//             "error": "Bad Request",
//             "message": "Latitude and Longitude are required"
//         });
//     }
//     const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
//     const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

//     const weather_data = await weatherController.getCurrentWeatherDataByLatLon(lat, lon, timezone, lang);
//     if(weather_data.error){
//         console.log("Error in api/v1/weather.js [65, 54] : ", weather_data.error);
//         return res.send({
//             "status": "failed",
//             "statusCode": weather_data.statusCode,
//             "error": weather_data.error,
//             "message": weather_data.message,
//             "data": weather_data.data
//         });
//     }
//     return res.send(weather_data);
// })

module.exports = router;