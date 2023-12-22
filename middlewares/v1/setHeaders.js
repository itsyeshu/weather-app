const { v4: uuid } = require('uuid');
const setHeaders = (req, res, next) => {
    req.id = uuid();
    next();
}
module.exports = setHeaders;