const axios = require("axios");

const DEFAULT = require("./constants");

// Endpoints
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1";
const GET_CITY_ID_URI = (name, limit, lang) => GEO_API_URL + `/search?name=${name}&count=${limit}&language=${lang}&format=json`;

// Helper functions
const clean_name = name => name.toLowerCase();
const clean_limit = limit => limit||DEFAULT.DEFAULT_CITY_LIMIT;
const clean_lang = lang => lang||DEFAULT.DEFAULT_LANG;
const country2flag = countryCode => (countryCode.replace(/./g, function(letter) {return String.fromCodePoint(letter.charCodeAt(0) % 32 + 0x1F1E5);}));

const fetchCitiesFromName = async (city_name, limit=DEFAULT.DEFAULT_CITY_LIMIT, lang=DEFAULT.DEFAULT_LANG) => {
    // Fetches city location data from city name
    //
    // @param city_name: Name of the city
    // @param limit: Number of results to return
    // @param lang: Language of the results
    //
    // @return: Array of city objects
    try{
        var { data:city_data } = await axios.get(GET_CITY_ID_URI(clean_name(city_name), clean_limit(limit), clean_lang(lang)));
    }catch(e){
        return {
            "status" : "failed",
            "statusCode" : 500,
            "error" : "Error fetching weather data for city",
            "message" : e.message,
            "query" : {
                "city": city_name,
                "lang": lang,
                "limit": limit
            },
            "data" : {
                "results": []
            },
            "count" : 0
        };
    }

    if(!city_data.results || city_data.results.length === 0)
        return {
            "status" : "failed",
            "statusCode" : 404,
            "error" : "City not found",
            "message" : `City with name "${city_name}" not found`,
            "query" : {
                "city": city_name,
                "lang": lang,
                "limit": limit
            },
            "data" : {"results": []},
            "count" : 0
        };
    const city_array = city_data.results.map(i=>({
        "id" : i.id,
        "lat" : Math.round(i.latitude * 10000) / 10000,
        "lon" : Math.round(i.longitude * 10000) / 10000,
        "city" : {
            "name" : i.name,
            "country_flag" : country2flag(i.country_code),
            "country_code" : i.country_code,
            "country" : i.country,
            "state" : i.admin1 || i.admin1 || "NA",
            "timezone" : i.timezone,
            "local_time" : new Date( new Date().toLocaleString('en-US', { timeZone : i.timezone })).toString()
        },
    }));
    return {
        "status" : "success",
        "statusCode" : 200,
        "query" : {
            "city": city_name,
            "lang": lang,
            "limit": limit
        },
        "data"  : {
            "results" : city_array,
        },
        "count" : city_array.length
    }
}

module.exports = {
    fetchCitiesFromName,
}