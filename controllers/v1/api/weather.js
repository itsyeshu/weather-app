const DEFAULT = require("./constants");
const weatherReducer = require(DEFAULT.REDUCER_DIR + "/weather");

const weatherAPIController = async (req, res) => {
    const city_name = req.query.city;
    const counter = req.query.counter || 1;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    if(city_name === ""){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "data" : {},
            "error": "Bad Request",
            "message": "City name is required"
        });
    }

    if(city_name === undefined){
        const lat = req.query.lat || "";
        const lon = req.query.lon || "";

        if(!lat || lat == "" || !lon || lon == "" || isNaN(lat) || isNaN(lon)){
            return res.status(200).send({
                "status": "failed",
                "statusCode": 400,
                "data" : {},
                "error": "Bad Request",
                "message": "Latitude and Longitude are required"
            });
        }
        const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
        const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

        const weather_data = await weatherReducer.getCurrentWeatherDataByLatLon(lat, lon, timezone, lang);
        if(weather_data.error){
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

    const weather_data = await weatherReducer.getCurrentWeatherData(city_name, counter, timezone, lang);
    if(weather_data.error){
        return res.send({
            "status": "failed",
            "statusCode": weather_data.statusCode,
            "error": weather_data.error,
            "message": weather_data.message,
            "data": weather_data.data
        });
    }
    return res.send(weather_data);
};

module.exports = {
    weatherAPIController,
};