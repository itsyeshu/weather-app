const axios = require("axios")

// Defaults
const DEFAULT = require("./constants");

// Controllers
const searchController = require("./search");
const airQualityController = require("./air_quality");

// API urls
const API_URL = "https://api.open-meteo.com/v1"

// Defaults & constants
const DIRECTION_ARRAY = ["North", "East", "South", "West"]
const WEEK_ARRAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_ARRAY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// API endpoints
const GET_CURRENT_WEATHER_URI = (lat, lon, timezone, lang) => API_URL + `/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&hourly=temperature_2m,weathercode,uv_index&current_weather=true&timezone=${timezone}&lang=${lang}`;

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
    const { data:city_array, count } = await searchController.fetchCitiesFromName(name, limit=Math.max(counter, DEFAULT.DEFAULT_CITY_LIMIT), lang);

    if(count == 0){
        return {
            "status": 404,
            "data" : null,
            "error": "City not found",
            "message": `City with name "${name}" does not exist`
        }
    }else if(counter > count){
        return {
            "status": 206,
            "data" : null,
            "error": "City not found in the given range",
            "message": `City with name "${name}" does not exist inside the range of "1 to ${city_array.length}"`
        }
    }

    const { id, lat, lon, city } = city_array[counter-1];
    const { data:weather_data } = await axios.get(GET_CURRENT_WEATHER_URI(lat, lon, timezone, lang));
    const { data:air_quality_index_data } = await airQualityController.fetchCurrentAirQualityIndex(lat, lon, date=weather_data.current_weather.time.split("T")[0], timezone);

    const current_hour = new Date(weather_data.current_weather.time).getHours();

    weather_data.hourly_units.windspeed_10m = "Km/h";
    weather_data.hourly_units.winddirection_10m = "°";

    const data = {
        "id" : id,
        "lat" : lat,
        "lon" : lon,
        "city_name" : city.name,
        "city" : city,

        "query" : {
            "city_name" : name,
            "results" : city_array,
            "counter" : counter,
            "results_count" : city_array.length,
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
        "status": 200,
        "data" : data,
    };
}

const getCurrentWeatherDataByLatLon = async (lat, lon, timezone = DEFAULT.DEFAULT_TIME_ZONE, lang=DEFAULT.DEFAULT_LANG) => {
    const { data:weather_data } = await axios.get(GET_CURRENT_WEATHER_URI(lat, lon, timezone, lang));
    const { data:air_quality_index_data } = await airQualityController.fetchCurrentAirQualityIndex(lat, lon, date=weather_data.current_weather.time.split("T")[0], timezone);

    const current_hour = new Date(weather_data.current_weather.time).getHours();

    weather_data.hourly_units.windspeed_10m = "Km/h";
    weather_data.hourly_units.winddirection_10m = "°";

    const data = {
        "lat" : lat,
        "lon" : lon,
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
        "status": 200,
        "data" : data,
    };
}

module.exports = {
    getCurrentWeatherData,
    getCurrentWeatherDataByLatLon,
}