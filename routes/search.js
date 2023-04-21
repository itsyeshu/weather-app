const express = require('express');
const router = express.Router();

const weatherController = require("../controllers/v1/weather");

router.get('/', async function(req, res) {
    const cities = [
        {
            "name": "Nanded",
            "counter" : 1,
            "tabs" : ["Hometown"]
        },
    ];
    const bulk_city_data = await weatherController.getBulkOnlyCurrentWeatherData(cities);
    if(bulk_city_data.error) {
        res.render('pages/city_not_found', {
            "statusCode": bulk_city_data.statusCode,
            "error": bulk_city_data.error,
            "message": bulk_city_data.message,
        })
    }
    console.log("Data : ", bulk_city_data.data.results);
    res.render('pages/search', {
        data : bulk_city_data.data.results,
    });
});

module.exports = router;