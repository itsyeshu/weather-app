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
            "error" : "Error fetching city from name",
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

    if(city_data.results == undefined || city_data.results.length == 0)
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

const fetchBulkCityFromName = async (city_names, city_counters, lang=DEFAULT.DEFAULT_LANG) => {
    if(city_names.length == 0){
        return {
            "status" : "failed",
            "statusCode" : 400,
            "error" : "Invalid request",
            "message" : "Provided empty city names array",
            "query" : {
                "city": city_names,
                "limit": city_counters,
                "lang": lang,
            },
            "data" : {}
        };
    }
    if(city_counters.length != city_names.length){
        return {
            "status" : "failed",
            "statusCode" : 400,
            "error" : "Invalid request",
            "message" : `Invalid request`,
            "query" : {
                "city": city_names,
                "limit": city_counters,
                "lang": lang,
            },
            "data" : {}
        };
    }
    const promises = city_names.map((city_name, index) => fetchCitiesFromName(city_name, city_counters[index] || 1, lang));
    var results = await Promise.all(promises);
    results = results.map((el, index) => ({
        ...el,
        "counter" : city_counters[index] || 1
    }))
    const failed_results = results.filter(result => result.error).map(city => {
        return {
            "city" : city.query.city,
            "error" : city.error,
        }
    });
    const successful_results = results.filter(result => result.error==undefined).map((city, index) => {
        const city_data = city.data.results[city.data.results.length - 1];
        return {
            "id" : city_data.id,
            "lat" : city_data.lat,
            "lon" : city_data.lon,
            "name" : city_data.city.name,
            "query_name" : city.query.city,
            "query_counter" : city.counter,
            "city" : city_data.city
        }
    });
    return {
        "status" : "success",
        "statusCode" : 200,
        "data" :{
            "results" : successful_results,
            "failed_results" : failed_results,
        },
        "count" : successful_results.length,
        "failed_count" : failed_results.length,
    };
}

module.exports = {
    fetchCitiesFromName,
    fetchBulkCityFromName,
}