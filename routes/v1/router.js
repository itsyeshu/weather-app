const express = require("express");
const router = express.Router();
const DEFAULT = require("./constants")

const morgan = require("morgan")
const cors = require("cors")

// Morgan tokens
morgan.token("id", req => req.id);
morgan.token("error", (req, res) => {
    if(res.locals.err){
        const err = res.locals.err;
        return "[(" + err.message + ") - "+ err.cause.statusCode + " " + err.cause.message + "]";
    }
    return null;
});
morgan.token("short_date", (req, res) => {
    return new Date().toISOString().split("T")[1];
});

// Import Middlewares
const middlewares = {
    setHeaders : require(`${DEFAULT.MIDDLEWARE_DIR}/setHeaders`),
    setLocales : require(`${DEFAULT.MIDDLEWARE_DIR}/setLocales`),
    accessLog : require(`${DEFAULT.MIDDLEWARE_DIR}/accessLog`),
    errorLog : require(`${DEFAULT.MIDDLEWARE_DIR}/errorLog`),
    errorParser : require(`${DEFAULT.MIDDLEWARE_DIR}/errorParser`),
}

// Import Routes
const routes = {
    search : require("./search"),
    weather : require("./weather"),
}

/// Middlewares
// Common request headers
router.use('/', middlewares.setHeaders)
// Common Locale variables
router.use('/', middlewares.setLocales)
// Access Logs
router.use('/', middlewares.accessLog)
// CORS
router.use(cors({
    origin: ["weather-api-itsyeshu.azurewebsites.net",],
    optionsSuccessStatus: 200
}))

// Routes
router.use('/', routes.search);
router.use('/search', routes.weather);

// Handle error middleware
router.use(middlewares.errorLog);
router.use(middlewares.errorParser);

module.exports = router;