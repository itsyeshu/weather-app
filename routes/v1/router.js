const express = require("express");
const router = express.Router();
const DEFAULT = require("./constants")

const morgan = require("morgan")
const cors = require("cors")

// Import Middlewares
const middlewares = {
    setLocales : require(`${DEFAULT.MIDDLEWARE_DIR}/setLocales`),
    accessLog : require(`${DEFAULT.MIDDLEWARE_DIR}/accessLog`),
    errorLog : require(`${DEFAULT.MIDDLEWARE_DIR}/errorLog`),
    // setHeaders : require(`${DEFAULT.MIDDLEWARE_DIR}/setHeaders`)
}

// Import Routes
const routes = {
    search : require("./search"),
    weather : require("./weather"),
}

/// Middlewares
// Common Locale variables
// router.use('/', middlewares.setHeaders)
router.use('/', middlewares.setLocales)
router.use('/', morgan(':date[clf] ":method :url HTTP/:http-version" :status'))

router.use(cors({
    origin: ["weather-api-itsyeshu.azurewebsites.net", "https://cecf-103-5-135-75.ngrok-free.app",],
    optionsSuccessStatus: 200
}))

// Routes
router.use('/', routes.search);
router.use('/search', routes.weather);



module.exports = router;