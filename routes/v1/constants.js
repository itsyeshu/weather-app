const API_VERSION = "v1";
const DEFAULT = {
    "API_VERSION" : API_VERSION,
    "CONTROLLER_DIR" : "../../controllers/" + API_VERSION,
    "REDUCER_DIR" : "../../reducers/" + API_VERSION,
    "DEFAULT_TIME_ZONE" : "Asia/Kolkata",
    "DEFAULT_CITY_LIMIT" : 4,
    "DEFAULT_CITY" : "Nanded",
    "DEFAULT_LANG" : "en",
}

DEFAULT["API_CONTROLLER_DIR"] = "../" + DEFAULT.CONTROLLER_DIR + "/api";
module.exports = DEFAULT;