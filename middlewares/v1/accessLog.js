const morgan = require('morgan')
const fs = require("fs")
const DEFAULT = require('./constants');

const ACCESS_LOG_DIR = `${DEFAULT.LOG_DIR}/access-logs`;
if(!fs.existsSync(ACCESS_LOG_DIR)){
    fs.mkdirSync(ACCESS_LOG_DIR, {recursive: true}, (err) => {
        if(err) console.log("Error while creating Directory : ", err);
    });
}

const accessLogStream = (date) => (fs.createWriteStream(
    `${ACCESS_LOG_DIR}/${date.toISOString().split("T")[0]}.log`,
    {flags: "a"}
));

const accessLogger = (req, res, next) => {
    morgan('[:short_date] :remote-addr (:id) - ":method :url HTTP/:http-version"', {
        "stream": accessLogStream(new Date()),
        "skip": (req, res) => res.statusCode >= 400
    })(req, res, next);
}


module.exports = accessLogger