const axios = require("axios")

// API urls
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1"
const API_URL = "https://api.open-meteo.com/v1"
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1"
// Defaults & constants
const DEFAULT_TIME_ZONE = "Asia/Calcutta";
const DIRECTION_ARRAY = ["North", "East", "South", "West"]
const WEEK_ARRAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_ARRAY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const AQI_LEVELS = {
    "pm10" : {
        "levels" : [50, 100, 250, 350, 430],
        "values" : [{"BPLo" : 0,"BPHi" : 50,"ILo" : 0,"IHi" : 50},{"BPLo" : 51,"BPHi" : 100,"ILo" : 51,"IHi" : 100},{"BPLo" : 101,"BPHi" : 250,"ILo" : 101,"IHi" : 200},{"BPLo" : 251,"BPHi" : 350,"ILo" : 201,"IHi" : 300},{"BPLo" : 351,"BPHi" : 430,"ILo" : 301,"IHi" : 400},{"BPLo" : 431,"BPHi" : 600,"ILo" : 401,"IHi" : 500}]
    },
    "pm2_5" : {
        "levels" : [30, 60, 90, 120, 250],
        "values" : [{"BPLo" : 0,"BPHi" : 30,"ILo" : 0,"IHi" : 50},{"BPLo" : 31,"BPHi" : 60,"ILo" : 51,"IHi" : 100},{"BPLo" : 61,"BPHi" : 90,"ILo" : 101,"IHi" : 200},{"BPLo" : 91,"BPHi" : 120,"ILo" : 201,"IHi" : 300},{"BPLo" : 121,"BPHi" : 250,"ILo" : 301,"IHi" : 400},{"BPLo" : 251,"BPHi" : 500,"ILo" : 401,"IHi" : 500}]
    },
    "carbon_monoxide" : {
        "levels" : [1000, 2000, 10000, 17000, 34000],
        "values" : [{"BPLo" : 0,"BPHi" : 1000,"ILo" : 0,"IHi" : 50},{"BPLo" : 1001,"BPHi" : 2000,"ILo" : 51,"IHi" : 100},{"BPLo" : 2001,"BPHi" : 10000,"ILo" : 101,"IHi" : 200},{"BPLo" : 10001,"BPHi" : 17000,"ILo" : 201,"IHi" : 300},{"BPLo" : 17001,"BPHi" : 34000,"ILo" : 301,"IHi" : 400},{"BPLo" : 34001,"BPHi" : 50000,"ILo" : 401,"IHi" : 500}]
    },
    "nitrogen_dioxide" : {
        "levels" : [40, 80, 180, 280, 400],
        "values" : [{"BPLo" : 0,"BPHi" : 40,"ILo" : 0,"IHi" : 50},{"BPLo" : 41,"BPHi" : 80,"ILo" : 51,"IHi" : 100},{"BPLo" : 81,"BPHi" : 180,"ILo" : 101,"IHi" : 200},{"BPLo" : 181,"BPHi" : 280,"ILo" : 201,"IHi" : 300},{"BPLo" : 281,"BPHi" : 400,"ILo" : 301,"IHi" : 400},{"BPLo" : 401,"BPHi" : 800,"ILo" : 401,"IHi" : 500}]
    },
    "sulphur_dioxide" : {
        "levels" : [40, 80, 380, 800, 1600],
        "values" : [{"BPLo" : 0,"BPHi" : 40,"ILo" : 0,"IHi" : 50},{"BPLo" : 41,"BPHi" : 80,"ILo" : 51,"IHi" : 100},{"BPLo" : 81,"BPHi" : 380,"ILo" : 101,"IHi" : 200},{"BPLo" : 381,"BPHi" : 800,"ILo" : 201,"IHi" : 300},{"BPLo" : 801,"BPHi" : 1600,"ILo" : 301,"IHi" : 400},{"BPLo" : 1601,"BPHi" : 3200,"ILo" : 401,"IHi" : 500}]
    },
    "ozone" : {
        "levels" : [50, 100, 168, 208, 748],
        "values" : [{"BPLo" : 0,"BPHi" : 50,"ILo" : 0,"IHi" : 50},{"BPLo" : 51,"BPHi" : 100,"ILo" : 51,"IHi" : 100},{"BPLo" : 101,"BPHi" : 168,"ILo" : 101,"IHi" : 200},{"BPLo" : 169,"BPHi" : 208,"ILo" : 201,"IHi" : 300},{"BPLo" : 209,"BPHi" : 748,"ILo" : 301,"IHi" : 400},{"BPLo" : 749,"BPHi" : 1000,"ILo" : 401,"IHi" : 500}]
    }
}

// API endpoints
const GET_CITY_ID_URI = (name) => GEO_API_URL + `/search?name=${name}`;
const GET_CURRENT_WEATHER_URI = (lat, lon, timezone=DEFAULT_TIME_ZONE) => API_URL + `/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&hourly=temperature_2m,weathercode,uv_index&current_weather=true&timezone=${timezone}`;
const GET_CURRENT_AIR_QUALITY_URI = (lat, lon, start_date, end_date, timezone=DEFAULT_TIME_ZONE) => (AIR_QUALITY_URL + `/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=${timezone}` + (start_date&&end_date?`&start_date=${start_date}&end_date=${end_date}`:''));

// Helper functions
const clean_name = name => name.toLowerCase()
const title_case = string => string.charAt(0).toUpperCase() + string.slice(1);
const mappingWeatherIdToIcon = (id) => {const mapping = {0 : {"desc" : "Clear sky","icon" : "01d","icon_night" : "01n","bg" : "bg-01d","bg_night" : "bg-01n",},1 : {"desc" : "Mainly clear sky","icon" : "02d","icon_night" : "02n","bg" : "bg-02d","bg_night" : "bg-02n",},2 : {"desc" : "Partly cloudy sky","icon" : "03d","icon_night" : "03n","bg" : "bg-03d","bg_night" : "bg-03n",},3 : {"desc" : "Overcast sky","icon" : "04d","icon_night" : "04n","bg" : "bg-04d","bg_night" : "bg-04n",},45 : {"desc" : "Fog","icon" : "50d","icon_night" : "50n","bg" : "bg-50d","bg_night" : "bg-50n",},48 : {"desc" : "Depositing fog","icon" : "50d","icon_night" : "50n","bg" : "bg-50d","bg_night" : "bg-50n",},51 : {"desc" : "Light drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},53 : {"desc" : "Moderate drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},55 : {"desc" : "Dense drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},56 : {"desc" : "Freezing light drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},57 : {"desc" : "Freezing dense drizzle","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},61 : {"desc" : "Slight intensity rain","icon" : "10d","icon_night" : "10n","bg" : "bg-10d","bg_night" : "bg-10n",},63 : {"desc" : "Moderate intensity rain","icon" : "10d","icon_night" : "10n","bg" : "bg-10d","bg_night" : "bg-10n",},65 : {"desc" : "Heavy intensity rain","icon" : "10d","icon_night" : "10n","bg" : "bg-10d","bg_night" : "bg-10n",},66 : {"desc" : "Freezing light rain","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},67 : {"desc" : "Freezing heavy rain","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},71 : {"desc" : "Light snow","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},73 : {"desc" : "Moderate snow","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},75 : {"desc" : "Heavy snow","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},77 : {"desc" : "Snowfall","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},80 : {"desc" : "Light rain shower","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},81 : {"desc" : "Moderate rain shower","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},85 : {"desc" : "Slight snow shower","icon" : "13d","icon_night" : "13n","bg" : "bg-13d","bg_night" : "bg-13n",},86 : {"desc" : "Heavy snow shower","icon" : "09d","icon_night" : "09n","bg" : "bg-09d","bg_night" : "bg-09n",},95 : {"desc" : "Thunderstorm","icon" : "11d","icon_night" : "11n","bg" : "bg-11d","bg_night" : "bg-11n",},96 : {"desc" : "Thunderstorm (hail)","icon" : "11d","icon_night" : "11n","bg" : "bg-11d","bg_night" : "bg-11n",},99 : {"desc" : "Thunderstorm (Heavy hail)","icon" : "11d","icon_night" : "11n","bg" : "bg-11d","bg_night" : "bg-11n",}};return mapping[id];}
const getCurrentWeatherInfo = (id, theme) => {const returned_data = mappingWeatherIdToIcon(id);returned_data.icon = !theme? returned_data.icon_night : returned_data.icon;return returned_data;}
// Converts country code to Emoji
const country2flag = countryCode => (countryCode.replace(/./g, function(letter) {return String.fromCodePoint(letter.charCodeAt(0) % 32 + 0x1F1E5);}));
const get12HrShortTimeFormat = time => {let [ hr, mn ] = time.split(":");time = hr;hr = new Number(hr);if(hr >= 12){time += " PM";if(hr != 12) hr -= 12;if(hr < 10) time = "0" + hr + time.slice(2);else time = hr + time.slice(2);}else if(hr == 0){time = "12" + time.slice(2) + " AM";}else {time += " AM";}return time;}
const get_uv_index_safety = level => (level>=8?"Very high":level>=6?"High":level>=3?"Moderate":level==0?"N.A.":"Low");
const getWeekDay = (date) => (WEEK_ARRAY[new Date(date).getDay()]);
const getShortDate = (date) => {var new_date = new Date(date);return new_date.getDate() + " " + MONTH_ARRAY[new_date.getMonth()];}
const addDays = (date, add) => {
    const new_date = new Date(date);
    new_date.setDate(new_date.getDate() + add);
    return (new_date.getFullYear() + "-" + (new_date.getMonth()<9?"0":"") + (new_date.getMonth() + 1) + "-" + (new_date.getDate()));
}

// Consult this code : https://app.cpcbccr.com/ccr_docs/FINAL-REPORT_AQI_.pdf
const calculateAQI = (particle_type, value) => {
    const getIndex = (levels, value) => {for(var i = 0; i<levels.length; i++){if(value >= levels[i]) return i;}return i;}
    const calculateAQI = (values, value) => {return Math.min(Math.round(((values.IHi - values.ILo)/(values.BPHi - values.BPLo)) * (value - values.BPLo) + values.ILo), 500);}
    return calculateAQI(AQI_LEVELS[particle_type].values[getIndex(AQI_LEVELS[particle_type].levels, value)], value);
}


// API calls
const fetchCityLocFromName = async name => {
    name = clean_name(name);
    const { data:weather_data } = await axios.get(GET_CITY_ID_URI(name));
    const city_array = weather_data.results.map(i=>{return {"id" : i.id,"lat" : Math.round(i.latitude * 1000) / 1000,"lon" : Math.round(i.longitude * 1000) / 1000,"city" : {"name" : i.name,"country_flag" : country2flag(i.country_code),"country_code" : i.country_code,"country" : i.country,"state" : i.admin1,}}});
    return city_array;
}

const getCurrentWeatherData = async (name, counter = 0, timezone = DEFAULT_TIME_ZONE) => {
    const city_array = await fetchCityLocFromName(name);
    const {id, lat, lon, city} = city_array[counter];
    const { data:weather_data } = await axios.get(GET_CURRENT_WEATHER_URI(lat, lon));
    const { data:air_quality_data } = await axios.get(GET_CURRENT_AIR_QUALITY_URI(lat, lon, start_date=weather_data.current_weather.time.split("T")[0], end_date=weather_data.current_weather.time.split("T")[0]));

    const current_hour = new Date(weather_data.current_weather.time).getHours();

    const air_quality = Math.max(calculateAQI("pm10" , air_quality_data.hourly.pm10[current_hour]),calculateAQI("pm2_5" , air_quality_data.hourly.pm2_5[current_hour]),calculateAQI("carbon_monoxide" , air_quality_data.hourly.carbon_monoxide[current_hour]),calculateAQI("nitrogen_dioxide" , air_quality_data.hourly.nitrogen_dioxide[current_hour]),calculateAQI("sulphur_dioxide" , air_quality_data.hourly.sulphur_dioxide[current_hour]),calculateAQI("ozone" , air_quality_data.hourly.ozone[current_hour]));

    weather_data.hourly_units.windspeed_10m = "Km/h";
    weather_data.hourly_units.winddirection_10m = "°";

    const data = {
        "id" : id,
        "lat" : lat,
        "lon" : lon,
        "city_name" : city.name,
        "city" : city,
        // "cities" : city_array,
        "timestamp" : weather_data.current_weather.time,

        "current" : {
            "theme" : weather_data.current_weather.is_day?"light":"dark",
            "weather" : getCurrentWeatherInfo(weather_data.current_weather.weathercode, weather_data.current_weather.is_day),
            "temperature" : Math.round(weather_data.current_weather.temperature),
            "temperature_unit" : weather_data.hourly_units.temperature_2m,
            
            // Minimum & Maximum temperatures
            // Apparent temperature is calculated using linear interpolation
            "temperature_max" : Math.round(weather_data.daily.temperature_2m_max[0]),
            "temperature_min" : Math.round(weather_data.daily.temperature_2m_min[0]),
            "apparent_temperature" : Math.round(weather_data.daily.apparent_temperature_max[0] - ((weather_data.daily.temperature_2m_max[0] - weather_data.current_weather.temperature)*(weather_data.daily.apparent_temperature_max[0] - weather_data.daily.apparent_temperature_min[0])/(weather_data.daily.temperature_2m_max[0] - weather_data.daily.temperature_2m_min[0]))),

            "others" : {
                "wind_speed" : weather_data.current_weather.windspeed,
                "wind_speed_unit" : weather_data.hourly_units.windspeed_10m,
                "wind_direction" : weather_data.current_weather.winddirection%90,
                "wind_direction_unit" : (weather_data.hourly_units.winddirection_10m + " " + DIRECTION_ARRAY[Math.floor((weather_data.current_weather.winddirection%360)/90)]),
                "uv_index" : weather_data.hourly.uv_index[current_hour],
                "uv_index_safety" : get_uv_index_safety(weather_data.hourly.uv_index[current_hour]),
                "air_quality" : air_quality,
                "air_quality_safety" : (air_quality>400?"Severe":air_quality>300?"Very poor":air_quality>200?"Poor":air_quality>100?"Moderate":air_quality>50?"Satisfactory":"Good"),
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
    // forecast_data = {} // Reseting not needed
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
    return data;
}

module.exports = {
    getCurrentWeatherData,
}