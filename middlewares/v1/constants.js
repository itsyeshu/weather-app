const path = require('path');
const APP_VERSION = "v1";
const BASE_DIR = path.join(__dirname, "..", "..");

const DEFAULT = {
    "LOG_DIR": path.join(BASE_DIR, ".logs", APP_VERSION),
    "VIEW_DIR": path.join(BASE_DIR, "views", APP_VERSION),
}

module.exports = DEFAULT;