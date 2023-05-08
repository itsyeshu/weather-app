const morgan = require('morgan')
const fs = require("fs")
const DEFAULT = require('./constants');

const ERROR_LOG_DIR = `${DEFAULT.LOG_DIR}/error-logs`;
if(!fs.existsSync(ERROR_LOG_DIR)){
    fs.mkdirSync(ERROR_LOG_DIR, {recursive: true}, (err) => {
        if(err) console.log("Error while creating Directory : ", err);
    });
}

const errorLogStream = (date) => (fs.createWriteStream(
    `${ERROR_LOG_DIR}/${date.toISOString().split("T")[0]}.log`,
    {flags: "a"}
));

const errorLogger = (err, req, res, next) => {
    morgan('[:short_date] (:id) - ":method :url HTTP/:http-version" :error', {
        "stream": errorLogStream(new Date()),
        "skip": (req, res, next) => res.locals.err == null
    })(req, res, next);
    return next(err);
}


module.exports = errorLogger