const LAT_LON_PRECISION = 3; // Can easily identify a village (Precision ~ 100m)

const constant = {
    "API_VERSION" : "v1",
    "DEFAULT_TIME_ZONE" : "Asia/Kolkata",
    "DEFAULT_CITY_LIMIT" : 4,
    "DEFAULT_CITY" : "Nanded",

    "DEFAULT_LANG" : "en",
    "SUPPORTED_LANGS" : ["en", "hi", "de"],


    "MAX_CITY_LIMIT" : 10,
    "BULK_CITY_LIMIT" : 4,

    "LAT_LON_ROUND" : LAT_LON_PRECISION,
    "round" : (num, n=LAT_LON_PRECISION) => +(Math.round(num + "e+"+n)  + "e-"+n),
}


module.exports = constant