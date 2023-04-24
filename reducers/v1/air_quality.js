const axios = require("axios");

// Defaults and constants
const DEFAULT = require("./constants");
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1"
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
const GET_CURRENT_AIR_QUALITY_URI = (lat, lon, start_date, end_date, timezone, lang) => (AIR_QUALITY_URL + `/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=${timezone}&lang=${lang}` + (start_date&&end_date?`&start_date=${start_date}&end_date=${end_date}`:''));

// Helper functions
const avgOfArray = (array) => Math.round(array.reduce((a, b) => a + b, 0) / array.length);
const addDays = (date, add) => {
    let new_date = new Date(date);
    new_date.setDate(new_date.getDate() + add);
    return (new_date.getFullYear() + "-" + (new_date.getMonth()<9?"0":"") + (new_date.getMonth() + 1) + "-" + (new_date.getDate()));
}

// Consult this code : https://app.cpcbccr.com/ccr_docs/FINAL-REPORT_AQI_.pdf
const calculateAQI = (particle_type, value) => {
    const getIndex = (levels, value) => {for(var i = 0; i<levels.length; i++){if(value <= levels[i]) break;}return i;}
    const calculateAQI = (values, value) => {return Math.round(((values.IHi - values.ILo)/(values.BPHi - values.BPLo)) * (value - values.BPLo) + values.ILo);}
    return calculateAQI(AQI_LEVELS[particle_type].values[getIndex(AQI_LEVELS[particle_type].levels, value)], value);
}
const calculateAQISatefy = aqi => (aqi>400?"Severe":aqi>300?"Very poor":aqi>200?"Poor":aqi>100?"Moderate":aqi>50?"Satisfactory":"Good");

const fetchCurrentAirQuality = async (lat, lon, start_date, end_date, timezone=DEFAULT.DEFAULT_TIME_ZONE, lang=DEFAULT.DEFAULT_LANG) => {
    // Fetches current air quality data from latitude and longitude
    //
    // @param lat: Latitude of the location
    // @param lon: Longitude of the location
    // @param start_date: Start date of the data
    // @param end_date: End date of the data
    // @param timezone: Timezone of the location
    // @param lang: Language of the data
    //
    // @return: Object of air quality data

    try{
        var { data:air_quality_data } = await axios.get(GET_CURRENT_AIR_QUALITY_URI(lat, lon, start_date, end_date, timezone, lang));
    }catch(err){
        return {
            "status" : "failed",
            "statusCode" : 500,
            "message" : "Error while fetching air quality data",
            "error" : err.message,
            "data" : {}
        }
    }
    const data = {
        "lat" : DEFAULT.round(air_quality_data.latitude),
        "lon" : DEFAULT.round(air_quality_data.longitude),
        "start_date" : air_quality_data.hourly.time[0].split("T")[0],
        "end_date" : air_quality_data.hourly.time[air_quality_data.hourly.time.length-1].split("T")[0],
        "timezone" : {
            "timezone" : air_quality_data.timezone,
            "timezone_abbr" : air_quality_data.timezone_abbreviation,
            "utc_offset_seconds" : air_quality_data.utc_offset_seconds
        },
        "units" : {
            "pm10" : air_quality_data.hourly_units.pm10,
            "pm2_5" : air_quality_data.hourly_units.pm2_5,
            "carbon_monoxide" : air_quality_data.hourly_units.carbon_monoxide,
            "nitrogen_dioxide" : air_quality_data.hourly_units.nitrogen_dioxide,
            "sulphur_dioxide" : air_quality_data.hourly_units.sulphur_dioxide,
            "ozone" : air_quality_data.hourly_units.ozone
        },
        "data" : {
            "time" : air_quality_data.hourly.time,
            "pm10" : air_quality_data.hourly.pm10,
            "pm2_5" : air_quality_data.hourly.pm2_5,
            "carbon_monoxide" : air_quality_data.hourly.carbon_monoxide,
            "nitrogen_dioxide" : air_quality_data.hourly.nitrogen_dioxide,
            "sulphur_dioxide" : air_quality_data.hourly.sulphur_dioxide,
            "ozone" : air_quality_data.hourly.ozone
        }
    }
    return {
        "status" : "success",
        "statusCode" : 200,
        "data" : data
    };
}

const fetchCurrentAirQualityIndex = async (lat, lon, date, timezone=DEFAULT.DEFAULT_TIME_ZONE, lang=DEFAULT.DEFAULT_LANG) => {
    const data = await fetchCurrentAirQuality(lat, lon, addDays(date, -1), date, timezone, lang);

    if(data.error)
        return {
            "status" : "failed",
            "statusCode" : data.statusCode,
            "error" : data.error,
            "message" : data.message,
            "data" : data.data 
        }

    const air_quality_data = data.data;

    const current_hour = new Date(new Date(air_quality_data.start_date).toLocaleString('en-US', { timeZone: air_quality_data.timezone.timezone })).getHours();

    const air_quality_indices = [
        calculateAQI("pm10" , avgOfArray(air_quality_data.data.pm10.slice(current_hour, 23+current_hour))),
        calculateAQI("pm2_5" , avgOfArray(air_quality_data.data.pm2_5.slice(current_hour, 23+current_hour))),
        calculateAQI("carbon_monoxide" , avgOfArray(air_quality_data.data.carbon_monoxide.slice(current_hour, 7+current_hour))),
        calculateAQI("nitrogen_dioxide" , avgOfArray(air_quality_data.data.nitrogen_dioxide.slice(current_hour, 23+current_hour))),
        calculateAQI("sulphur_dioxide" , avgOfArray(air_quality_data.data.sulphur_dioxide.slice(current_hour, 23+current_hour))),
        calculateAQI("ozone" , avgOfArray(air_quality_data.data.ozone.slice(current_hour, 7+current_hour)))];

    return {
        "status" : "success",
        "statusCode" : 200,
        "data" : {
            "lat" : DEFAULT.round(air_quality_data.lat),
            "lon" : DEFAULT.round(air_quality_data.lon),
            "start_date" : air_quality_data.start_date,
            "end_date" : air_quality_data.end_date,
            "timezone" : air_quality_data.timezone,
            "standard" : "National AQI, CPCB India",
            "data" : {
                "aqi" : Math.max(...air_quality_indices),
                "aqi_safety" : calculateAQISatefy(Math.max(...air_quality_indices)),
                "pm10" : air_quality_indices[0],
                "pm2_5" : air_quality_indices[1],
                "carbon_monoxide" : air_quality_indices[2],
                "nitrogen_dioxide" : air_quality_indices[3],
                "sulphur_dioxide" : air_quality_indices[4],
                "ozone" : air_quality_indices[5]
            }
        }
    }
}


module.exports = {
    fetchCurrentAirQuality,
    fetchCurrentAirQualityIndex
}