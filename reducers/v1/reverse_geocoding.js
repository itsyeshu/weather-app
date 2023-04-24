const axios = require("axios");

require('dotenv').config();

// Constants
const DEFAULT = require("./constants")
const REVERSE_GEO_API_KEY = process.env.REVERSE_GEO_API_KEY;
const REVERSE_GEO_API_URL = (lat, lon, lang) => `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=${lang}&apiKey=${REVERSE_GEO_API_KEY}`

// Helper functions
const country2flag = countryCode => (countryCode.replace(/./g, function(letter) {return String.fromCodePoint(letter.charCodeAt(0) % 32 + 0x1F1E5);}));

const getCityByLatLon = async (lat, lon, lang=DEFAULT.DEFAULT_LANG) => {
    try{
        var { data } = await axios.get(REVERSE_GEO_API_URL(lat, lon, lang));
    }catch(e){
        return {
            "status" : "failed",
            "statusCode" : 500,
            "error" : "Error fetching city from Lat Lon",
            "message" : e.message,
            "data" : {
                "results" : []
            },
            "count" : 0,
        }
    }
    const features = data.features.filter(city => city.properties.result_type != 'unknown').map(city => {
        const city_name = city.properties.state_district || city.properties.city || city.properties.county;
        return {
            "lat" : DEFAULT.round(city.properties.lat),
            "lon" : DEFAULT.round(city.properties.lon),
            "name" : city_name,
            "city" : {
                "city" : city_name,
                "state" : city.properties.state || "N.A.",
                "country" : city.properties.country,
                "country_flag" : country2flag(city.properties.country_code.toLowerCase()),
                "country_code" : city.properties.country_code.toUpperCase(),
                "timezone" : city.properties.timezone.name,
            }
        }
    });
    if(features.length === 0){
        return {
            "status" : "failed",
            "statusCode" : 404,
            "error" : "Data not found",
            "message" : "Data not found for entered location (" + lat + ", " + lon + ")",
            "data" : {
                "results" : []
            },
            "count" : 0,
        }
    }
    return {
        "status" : "success",
        "statusCode" : 200,
        "data" : {
            "results" : features,
        },
        "count" : features.length,
    };
}

module.exports = {
    getCityByLatLon,
}