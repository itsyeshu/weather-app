const express = require('express');
const router = express.Router();

const weatherController = require("../controllers/v1/weather");

router.get('/', async function(req, res) {
    const city_name = req.query.city || "";
    const counter = req.query.counter || 0;

    if(!city_name || city_name == ""){
        return res.redirect('/');
    }
    try{
        const data = await weatherController.getCurrentWeatherData(city_name, counter);
        if(data.error){
            return res.render('pages/city_not_found', {
                "error_code": "HTTP " + data.status,
                "error": data.error,
                "message": data.message,
            });
        }
        res.render('pages/weather', {
            "data" : data,
        });
    }catch(e){
        console.log(e);
    }
});

module.exports = router;