const DEFAULT = require("./constants");
const weatherReducer = require(DEFAULT.REDUCER_DIR +"/weather");

const searchController = async function(req, res) {
    const cities = [
        {
            "name": "Nanded",
            "counter" : 1,
        },
        {
            "name": "Pune",
            "counter" : 1,
        },
    ];
    const bulk_city_data = await weatherReducer.getBulkOnlyCurrentWeatherData(cities);
    if(bulk_city_data.error) {
        res.render('v1/pages/error_page', {
            "statusCode": bulk_city_data.statusCode,
            "error": bulk_city_data.error,
            "message": bulk_city_data.message,
        })
    }
    res.render('v1/pages/search', {
        data : bulk_city_data.data.results,
    });
};


module.exports = {
    searchController,
};