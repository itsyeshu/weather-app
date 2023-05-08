const uuid = require('node-uuid').v4;

const setHeaders = (req, res, next) => {
    req.id = uuid();
    next();
}


module.exports = setHeaders;