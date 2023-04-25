const axios = require("axios")

// Defaults
const DEFAULT = require("./constants");

// Controllers
const searchReducer = require("./search");
const aqiReducer = require("./air_quality");
const reverseGeocodingReducer = require("./reverse_geocoding");

// API urls
const API_URL = "https://api.open-meteo.com/v1"

// Defaults & constants
const DIRECTION_ARRAY = ["North", "East", "South", "West"]
const WEEK_ARRAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_ARRAY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// API endpoints
const GET_CURRENT_WEATHER_URI = (lat, lon, timezone, lang) => API_URL + `/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&hourly=temperature_2m,weathercode,uv_index&current_weather=true&timezone=${timezone}&lang=${lang}`;
const GET_ONLY_CURRENT_WEATHER_URI = (lat, lon, lang) => API_URL + `/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&lang=${lang}`;

// Helper functions
const mappingWeatherIdToIcon = (id) => {const mapping = {0 : {"desc" : "Clear sky","icon" : "01d","icon_night" : "01n","bg" : "bg-01d","bg_night" : "bg-01n",},1 : {"desc" : "Mainly clear sky","icon" : "02d","icon_night" : "02n","bg" : "bg-02d","bg_night" : "bg-02n",},2 : {"desc" : "Partly cloudy sky","icon" : "03d","icon_night" : "03n","bg" : "bg-03d","bg_night" : "bg-03n",},3 : {"desc" : "Overcast sky","icon" : "04d","icon_night" : "04n","bg" : "bg-04d","bg_night" : "bg-04n",},45 : {"desc" : "Fog","icon" : "50d","icon_night" : "50n","bg" : "bg-50d","bg_night" : "bg-50n",},48 : {"desc" : "Depositing fog","icon" : "50d","icon_night" : "50n","bg" : "bg-50d","bg_night" : "bg-50n",},51 : {"desc" : "Light drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},53 : {"desc" : "Moderate drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},55 : {"desc" : "Dense drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},56 : {"desc" : "Freezing light drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},57 : {"desc" : "Freezing dense drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},61 : {"desc" : "Slight intensity rain","icon" : "10d","icon_night" : "10n","bg" : "bg-10d","bg_night" : "bg-10n",},63 : {"desc" : "Moderate intensity rain","icon" : "10d","icon_night" : "10n","bg" : "bg-10d","bg_night" : "bg-10n",},65 : {"desc" : "Heavy intensity rain","icon" : "10d","icon_night" : "10n","bg" : "bg-10d","bg_night" : "bg-10n",},66 : {"desc" : "Freezing light rain","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},67 : {"desc" : "Freezing heavy rain","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},71 : {"desc" : "Light snow","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},73 : {"desc" : "Moderate snow","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},75 : {"desc" : "Heavy snow","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},77 : {"desc" : "Snowfall","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},80 : {"desc" : "Light rain shower","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},81 : {"desc" : "Moderate rain shower","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},85 : {"desc" : "Slight snow shower","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},86 : {"desc" : "Heavy snow shower","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},95 : {"desc" : "Thunderstorm","icon" : "11d","icon_night" : "11n","bg" : "bg-11d","bg_night" : "bg-11n",},96 : {"desc" : "Thunderstorm (hail)","icon" : "11d","icon_night" : "11n","bg" : "bg-11d","bg_night" : "bg-11n",},99 : {"desc" : "Thunderstorm (Heavy hail)","icon" : "11d","icon_night" : "11n","bg" : "bg-11d","bg_night" : "bg-11n",}};return mapping[id];}
const getCurrentWeatherInfo = (id, theme) => {const returned_data = mappingWeatherIdToIcon(id);returned_data.icon = !theme? returned_data.icon_night : returned_data.icon;return returned_data;}
// Converts country code to Emoji
const get12HrShortTimeFormat = time => {let [ hr, mn ] = time.split(":");time = hr;hr = new Number(hr);if(hr >= 12){time += " PM";if(hr != 12) hr -= 12;if(hr < 10) time = "0" + hr + time.slice(2);else time = hr + time.slice(2);}else if(hr == 0){time = "12" + time.slice(2) + " AM";}else {time += " AM";}return time;}
const get_uv_index_safety = level => (level>=8?"Very high":level>=6?"High":level>=3?"Moderate":level==0?"N.A.":"Low");
const getWeekDay = (date) => (WEEK_ARRAY[new Date(date).getDay()]);
const getShortDate = (date) => {var new_date = new Date(date);return new_date.getDate() + " " + MONTH_ARRAY[new_date.getMonth()];}

// Controller functions
const getCurrentWeatherData = async (name, counter = 1, timezone = DEFAULT.DEFAULT_TIME_ZONE, lang=DEFAULT.DEFAULT_LANG) => {
    counter = Math.max(1, parseInt(counter));
    const _cities_data = await searchReducer.fetchCitiesFromName(name, limit=Math.max(counter, DEFAULT.DEFAULT_CITY_LIMIT), lang);
    if(_cities_data.error){
        return {
            "status": "failed",
            "statusCode": _cities_data.statusCode,
            "error": _cities_data.error,
            "message": _cities_data.message,
            "data": _cities_data.data
        }
    }
    const { data:cities, count } = _cities_data;
    if(counter > count){
        return {
            "status" : "failed",
            "statusCode": 206,
            "error": "City not found at the given index",
            "message": `City with name "${name}" not found at index : ${counter}. ` + (count>1?`Accepted values are "1 - ${count}"`: "Accepted value is 1"),
            "data" : {},
        }
    }

    const { id, lat, lon, city } = cities.results[counter-1];

    try{
        var { data:weather_data } = await axios.get(GET_CURRENT_WEATHER_URI(lat, lon, timezone, lang));
    }catch(err){
        return {
            "status" : "failed",
            "statusCode": 500,
            "error": "Internal server error",
            "message": err.message,
            "data" : {},
        }
    }
    const { data:_air_quality_index_data } = await aqiReducer.fetchCurrentAirQualityIndex(lat, lon, date=weather_data.current_weather.time.split("T")[0], timezone);
    if(_air_quality_index_data.error){
        return {
            "status": "failed",
            "statusCode": _air_quality_index_data.statusCode,
            "error": _air_quality_index_data.error,
            "message": _air_quality_index_data.message,
            "data": {}
        }
    }
    const air_quality_index_data = _air_quality_index_data.data;
    const current_hour = new Date(weather_data.current_weather.time).getHours();

    weather_data.hourly_units.windspeed_10m = "Km/h";
    weather_data.hourly_units.winddirection_10m = "°";

    const tabs = [];

    // My city Nanded's tab as "Hometown"
    // if(id == 1261977) tabs.push({
    //     "tab" : "Hometown",
    //     "class" : "",
    // });
    if(Math.round(weather_data.current_weather.temperature) > 40) tabs.push({
        "tab" : "Stay home, intense heat!!",
        "class" : "tab_alert",
    });

    const data = {
        "id" : id,
        "lat" : DEFAULT.round(lat),
        "lon" : DEFAULT.round(lon),
        "city_name" : city.name,
        "city" : city,
        "tabs" : tabs,
        "query" : {
            "city_name" : name,
            "counter" : counter,
            "timezone" : timezone,
            "lang" : lang,
            "results" : cities.results,
            "results_count" : count,
        },
        "current" : {
            "dark_theme" : !weather_data.current_weather.is_day,
            "weather" : getCurrentWeatherInfo(weather_data.current_weather.weathercode, weather_data.current_weather.is_day),
            "temperature" : Math.round(weather_data.current_weather.temperature),
            "temperature_unit" : weather_data.hourly_units.temperature_2m,
            
            // Minimum & Maximum temperatures
            // Apparent temperature is calculated using linear interpolation
            "temperature_max" : Math.round(weather_data.daily.temperature_2m_max[0]),
            "temperature_min" : Math.round(weather_data.daily.temperature_2m_min[0]),
            "apparent_temperature" : Math.round(weather_data.daily.apparent_temperature_max[0] - ((weather_data.daily.temperature_2m_max[0] - weather_data.current_weather.temperature)*(weather_data.daily.apparent_temperature_max[0] - weather_data.daily.apparent_temperature_min[0])/(weather_data.daily.temperature_2m_max[0] - weather_data.daily.temperature_2m_min[0]))),

            "others" : {
                "wind_speed" : Math.round(weather_data.current_weather.windspeed),
                "wind_speed_unit" : weather_data.hourly_units.windspeed_10m,
                "wind_direction" : weather_data.current_weather.winddirection%90,
                "wind_direction_unit" : (weather_data.hourly_units.winddirection_10m + " " + DIRECTION_ARRAY[Math.floor((weather_data.current_weather.winddirection%360)/90)]),
                "uv_index" : weather_data.hourly.uv_index[current_hour],
                "uv_index_safety" : get_uv_index_safety(weather_data.hourly.uv_index[current_hour]),
                "air_quality" : air_quality_index_data.aqi,
                "air_quality_safety" : air_quality_index_data.aqi_safety,
            },
        },
        "hourly" : {
            "forecast" : {}
        },
        "daily" : {
            "forecast" : {}
        }
    }

    let forecast_data = weather_data.hourly;
    for(let key in forecast_data){
        forecast_data[key] = forecast_data[key].slice(current_hour+1,current_hour+13);
        if(key == "time"){
            forecast_data[key] = forecast_data[key].map(el => get12HrShortTimeFormat(el.split("T")[1]));
        }
        if(key == "weathercode"){
            forecast_data[key] = forecast_data[key].map(el => getCurrentWeatherInfo(el, weather_data.current_weather.is_day));
        }
    }
    data.hourly.forecast = forecast_data;
    forecast_data = weather_data.daily;
    for(let key in forecast_data){
        if(key == "time"){
            forecast_data["day"] = forecast_data[key].map(el => getWeekDay(el));
            forecast_data[key] = forecast_data[key].map(el => getShortDate(el));
        }
        if(key == "weathercode"){
            forecast_data[key] = forecast_data[key].map(el => getCurrentWeatherInfo(el, weather_data.current_weather.is_day));
        }
    }
    data.daily.forecast = forecast_data;
    return {
        "status" : "success",
        "statusCode": 200,
        "data" : data,
    };
}

const getOnlyCurrentWeatherData = async (name, counter = 1, timezone = DEFAULT.DEFAULT_TIME_ZONE, lang=DEFAULT.DEFAULT_LANG) => {
    let cities_data = await searchReducer.fetchCitiesFromName(name, counter, lang);
    if(cities_data.error){
        return {
            "status" : "failed",
            "statusCode" : cities_data.statusCode,
            "error" : cities_data.error,
            "message" : cities_data.message,
            "data" : {}
        }
    }
    try{
        var { results:cities, count } = cities_data.data;
        if(counter > count){
            return {
                "status" : "failed",
                "statusCode" : 404,
                "error" : "City not found at the specified index",
                "message" : `City not found at the specified index ${counter} (Total results: ${count})`,
                "data" : {
                    "results" : [],
                },
                "count" : 0,
            }
        }
        var { id, lat, lon, city} = cities[counter-1];
        var { data : weather_data } = await axios.get(GET_ONLY_CURRENT_WEATHER_URI(lat, lon, timezone, lang));
        const data = {
            "id" : id,
            "lat" : DEFAULT.round(lat),
            "lon" : DEFAULT.round(lon),
            "name" : city.name,
            "tabs" : [],
            "query" : {
                "city" : name,
                "counter" : counter,
                "lang" : lang,
                "timezone" : timezone,
            },
            "city" : city,
            "weather" : {
                "temperature" : Math.round(weather_data.current_weather.temperature),
                "temperature_unit" : "°C",
                "weather" : getCurrentWeatherInfo(weather_data.current_weather.weathercode, weather_data.current_weather.is_day),
                "is_day" : weather_data.current_weather.is_day,
            }
        }
        return {
            "status" : "success",
            "statusCode": 200,
            "data" : data,
        };
    } catch(err){
        return {
            "status" : "failed",
            "statusCode": 500,
            "error": "Internal server error",
            "message": err.message,
            "data" : {}
        }
    }
}

const getCurrentWeatherDataByLatLon = async (lat, lon, timezone = DEFAULT.DEFAULT_TIME_ZONE, lang=DEFAULT.DEFAULT_LANG) => {
    try{
        var { data:weather_data } = await axios.get(GET_CURRENT_WEATHER_URI(lat, lon, timezone, lang));
    } catch(err){
        return {
            "status" : "failed",
            "statusCode": 500,
            "error": "Internal server error",
            "message": err.message,
        }
    }
    const { data:_air_quality_index_data } = await aqiReducer.fetchCurrentAirQualityIndex(lat, lon, date=weather_data.current_weather.time.split("T")[0], timezone);

    if(_air_quality_index_data.error){
        return {
            "status" : "failed",
            "statusCode" : _air_quality_index_data.statusCode,
            "error" : _air_quality_index_data.error,
            "message" : _air_quality_index_data.message,
            "data" : _air_quality_index_data.data,
        }
    }

    const air_quality_index_data = _air_quality_index_data.data;

    const _cities_data = await reverseGeocodingReducer.getCityByLatLon(lat, lon, lang);
    if(_cities_data.error){
        return {
            "status" : "failed",
            "statusCode" : _cities_data.statusCode,
            "error" : _cities_data.error,
            "message" : _cities_data.message,
            "data" : _cities_data.data,
        }
    }
    const cities_data = _cities_data.data;
    const city = cities_data.results[0];
    const current_hour = new Date(weather_data.current_weather.time).getHours();

    weather_data.hourly_units.windspeed_10m = "Km/h";
    weather_data.hourly_units.winddirection_10m = "°";

    
    const tabs = [];
    if(Math.round(weather_data.current_weather.temperature) > 40) tabs.push({
        "tab" : "Stay home, intense heat",
        "class" : "tab_alert",
    });

    const data = {
        "lat" : DEFAULT.round(city.lat),
        "lon" : DEFAULT.round(city.lon),
        "city_name" : city.name,
        "city" : city.city,
        "tabs" : tabs,
        "query" : {
            "lat" : lat,
            "lon" : lon,
            "timezone" : timezone,
            "lang" : lang,
        },
        "current" : {
            "dark_theme" : !weather_data.current_weather.is_day,
            "weather" : getCurrentWeatherInfo(weather_data.current_weather.weathercode, weather_data.current_weather.is_day),
            "temperature" : Math.round(weather_data.current_weather.temperature),
            "temperature_unit" : weather_data.hourly_units.temperature_2m,
            
            // Minimum & Maximum temperatures
            // Apparent temperature is calculated using linear interpolation
            "temperature_max" : Math.round(weather_data.daily.temperature_2m_max[0]),
            "temperature_min" : Math.round(weather_data.daily.temperature_2m_min[0]),
            "apparent_temperature" : Math.round(weather_data.daily.apparent_temperature_max[0] - ((weather_data.daily.temperature_2m_max[0] - weather_data.current_weather.temperature)*(weather_data.daily.apparent_temperature_max[0] - weather_data.daily.apparent_temperature_min[0])/(weather_data.daily.temperature_2m_max[0] - weather_data.daily.temperature_2m_min[0]))),


            "others" : {
                "wind_speed" : Math.round(weather_data.current_weather.windspeed),
                "wind_speed_unit" : weather_data.hourly_units.windspeed_10m,
                "wind_direction" : weather_data.current_weather.winddirection%90,
                "wind_direction_unit" : (weather_data.hourly_units.winddirection_10m + " " + DIRECTION_ARRAY[Math.floor((weather_data.current_weather.winddirection%360)/90)]),
                "uv_index" : weather_data.hourly.uv_index[current_hour],
                "uv_index_safety" : get_uv_index_safety(weather_data.hourly.uv_index[current_hour]),
                "air_quality" : air_quality_index_data.aqi,
                "air_quality_safety" : air_quality_index_data.aqi_safety,
            },
        },
        "hourly" : {
            "forecast" : {}
        },
        "daily" : {
            "forecast" : {}
        }
    }

    let forecast_data = weather_data.hourly;
    for(let key in forecast_data){
        forecast_data[key] = forecast_data[key].slice(current_hour+1,current_hour+13);
        if(key == "time"){
            forecast_data[key] = forecast_data[key].map(el => get12HrShortTimeFormat(el.split("T")[1]));
        }
        if(key == "weathercode"){
            forecast_data[key] = forecast_data[key].map(el => getCurrentWeatherInfo(el, weather_data.current_weather.is_day));
        }
    }
    data.hourly.forecast = forecast_data;
    forecast_data = weather_data.daily;
    for(let key in forecast_data){
        if(key == "time"){
            forecast_data["day"] = forecast_data[key].map(el => getWeekDay(el));
            forecast_data[key] = forecast_data[key].map(el => getShortDate(el));
        }
        if(key == "weathercode"){
            forecast_data[key] = forecast_data[key].map(el => getCurrentWeatherInfo(el, weather_data.current_weather.is_day));
        }
    }
    data.daily.forecast = forecast_data;
    return {
        "status": "success",
        "statusCode": 200,
        "data" : data,
    };
}

const getOnlyCurrentWeatherDataByLatLon = async (lat, lon, lang=DEFAULT.DEFAULT_LANG) => {
    try{
        var data = await axios.get(GET_ONLY_CURRENT_WEATHER_URI(lat, lon, lang));
    } catch(err){
        return {
            "status" : "failed",
            "statusCode": 500,
            "error": "Internal server error",
            "message": err.message,
            "data" : {}
        }
    }
    data.data.tabs = [];
    if(data.data.current_weather.temperature > 40){
        data.data.tabs.push({
            "name" : "Stay home, intense heat",
            "class" : "tab_alert",
        });
    }
    return {
        "status" : "success",
        "statusCode": 200,
        "data" : data.data,
    };
}

const getBulkOnlyCurrentWeatherData = async (city_names, city_counters, lang=DEFAULT.DEFAULT_LANG) => {
    const cities_data = await searchReducer.fetchBulkCityFromName(city_names, city_counters, lang);
    if(cities_data.error){
        return {
            "status" : "failed",
            "statusCode" : cities_data.statusCode,
            "error" : cities_data.error,
            "message" : cities_data.message,
            "query" : cities_data.query,
            "data" : {}
        }
    }

    if(city_names.length > DEFAULT.BULK_CITY_LIMIT){
        return {
            "status" : "failed",
            "statusCode" : 400,
            "error" : "Bad request",
            "message" : "Bulk city limit (" + DEFAULT.BULK_CITY_LIMIT + ") exceeded",
            "query" : city_names,
            "data" : {}
        }
    }

    try{
        var bulk_weather_promises = cities_data.data.results.map(city => getOnlyCurrentWeatherDataByLatLon(city.lat, city.lon, lang));
        var bulk_weather_data = await Promise.all(bulk_weather_promises);
        bulk_weather_data = bulk_weather_data.map(el => el.data);
        const results = []
        for(let i=0; i<bulk_weather_data.length; i++){
            results.push({
                "id" : cities_data.data.results[i].id,
                "lat" : DEFAULT.round(bulk_weather_data[i].latitude),
                "lon" : DEFAULT.round(bulk_weather_data[i].longitude),
                "name" : cities_data.data.results[i].name,
                "tabs" : bulk_weather_data[i].tabs,
                "query" : {
                    "city" : cities_data.data.results[i].query_name,
                    "counter" : cities_data.data.results[i].query_counter,
                },
                "city" : cities_data.data.results[i].city,
            });
        }
        bulk_weather_data = bulk_weather_data.map(el => ({
            "temperature" : Math.round(el.current_weather.temperature),
            "temperature_unit" : "°C",
            "weather" : getCurrentWeatherInfo(el.current_weather.weathercode, el.current_weather.is_day),
            "is_day" : el.current_weather.is_day,
        }))
        for(let i=0; i<bulk_weather_data.length; i++){
            results[i].weather = bulk_weather_data[i];
        }
        return {
            "status" : "success",
            "statusCode": 200,
            "data" : {
                "results" : results,
                "failed_results" : cities_data.data.failed_results,
            },
        }
    }catch(err){
        return {
            "status" : "failed",
            "statusCode": 500,
            "error": "Internal server error",
            "message": err.message,
            "data" : {}
        }
    }
}


module.exports = {
    getCurrentWeatherData,
    getCurrentWeatherDataByLatLon,

    getOnlyCurrentWeatherData,

    getBulkOnlyCurrentWeatherData,
    getOnlyCurrentWeatherDataByLatLon,
}