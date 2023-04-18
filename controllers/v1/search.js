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

    const { data:city_data } = await axios.get(GET_CITY_ID_URI(clean_name(city_name), clean_limit(limit), clean_lang(lang)));
    if(!city_data.results || city_data.results.length === 0) return {"data" : [], "count" : 0};
    const city_array = city_data.results.map(i=>{return {"id" : i.id,"lat" : Math.round(i.latitude * 1000) / 1000,"lon" : Math.round(i.longitude * 1000) / 1000,"city" : {"name" : i.name,"country_flag" : country2flag(i.country_code),"country_code" : i.country_code,"country" : i.country,"state" : i.admin1 || "(N.A.)",}}});
    return {
        "data"  : city_array,
        "count" : city_array.length
    }
}

module.exports = {
    fetchCitiesFromName,
}