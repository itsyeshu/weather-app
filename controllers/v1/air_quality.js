const DEFAULT = require("./constants");
const aqiReducer = require(DEFAULT.REDUCER_DIR + "/air_quality");
const searchReducer = require(DEFAULT.REDUCER_DIR + "/search");

const aqiController = async (req, res) => {
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

    const city_name = req.query.city;
    let counter = parseInt(req.query.counter || 1);
    const limit = Math.max(DEFAULT.DEFAULT_CITY_LIMIT, counter);
    const start_date = req.query.start_date || undefined;
    const end_date = req.query.end_date || undefined;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    
    if(city_name === ""){
        return res.status(200).send({
            "status": "success",
            "statusCode": 400,
            "error": "Bad Request",
            "message": "City name is required",
            "data" : {}
        });
    }

    if(city_name === undefined){
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
                return res.status(200).send({
                    "status": "failed",
                    "statusCode": 400,
                    "error": "Bad Request",
                    "message": "Latitude and Longitude are required and must be numbers"
                });
            }
            const date = req.query.date || undefined;
            const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
            const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

            try{
                const air_quality = await aqiReducer.fetchCurrentAirQualityIndex(lat, lon, date, timezone, lang);
                return res.status(200).send({
                    "status": "success",
                    "statusCode": 200,
                    "message": "Success",
                    "data": air_quality,
                });
            }catch(err) {
                return res.status(200).send({
                    "status": "failed",
                    "statusCode": 500,
                    "error": "Internal Server Error",
                    "message": `${err.message}`
                })
            };
    }
    if (isNaN(counter) || counter <= 0){
        return res.status(400).send({
            "status": "success",
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Counter must be a positive integer"
        });
    }
    const _cities_data = await searchReducer.fetchCitiesFromName(city_name, limit, lang);
    if(_cities_data.error){
        return res.status(200).send({
            "status": "failed",
            "statusCode": _cities_data.statusCode,
            "error": _cities_data.error,
            "message": _cities_data.message,
            "data" : _cities_data.data
        });
    }
    const city_array = _cities_data.data.results;
    const count = _cities_data.count;
    if(counter > count){
        return res.status(200).send({
            "status": "success",
            "statusCode": 206,
            "error": "City not found at provided index",
            "message": `City with name "${city_name}" not found at index : ${counter}. ` + (count > 1 ? `Accepted values are "1 - ${count}"` : `Accepted value is "1"`)
        })
    }
    const city = city_array[counter-1];
    const _air_quality_data = await aqiReducer.fetchCurrentAirQualityIndex(city.lat, city.lon, start_date, end_date, timezone, lang);
    if(_air_quality_data.error){
        return res.status(200).send({
            "status": "failed",
            "statusCode": _air_quality_data.statusCode,
            "error": _air_quality_data.error,
            "message": _air_quality_data.message,
            "data" : _air_quality_data.data
        });
    }
    const air_quality = _air_quality_data.data;
    return res.status(200).send({
        "status": "success",
        "statusCode": 200,
        "city": city,
        "data": air_quality,
    });
};

module.exports = {
    aqiController,
};