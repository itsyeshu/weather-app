const express = require('express');
const router = express.Router();

const DEFAULT_TIME_ZONE = "Asia/Kolkata";
const DEFAULT_LANG = "en";

const weatherController = require("../controllers/v1/weather");

router.get('/', async function(req, res) {
    const city_name = req.query.city || "";
    const counter = req.query.counter || 0;
    const timezone = req.query.timezone || DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT_LANG;

    if(!city_name || city_name == ""){
        const lat = req.query.lat || "";
        const lon = req.query.lon || "";
        if(!lat || lat == "" || !lon || lon == "" || isNaN(lat) || isNaN(lon)){
            return res.redirect('/');
        }
        try{
            const data = await weatherController.getCurrentWeatherDataByLatLon(lat, lon, timezone, lang);
            if(data.error){
                return res.render('pages/city_not_found', {
                    "error_code": "HTTP " + data.statusCode,
                    "error": data.error,
                    "message": data.message,
                });
            }
            return res.render('pages/latlon_weather', {
                "data" : data.data,
            });
        }catch(e){
            console.log(e);
        }
    }
    try{
        const data = await weatherController.getCurrentWeatherData(city_name, counter, timezone, lang);
        if(data.error){
            return res.render('pages/city_not_found', {
                "error_code": "HTTP " + data.statusCode,
                "error": data.error,
                "message": data.message,
            });
        }
        return res.render('pages/weather', {
            "data" : data.data,
        });
    }catch(e){
        console.log(e);
    }
});

module.exports = router;