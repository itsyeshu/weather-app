const errorLogger = (req, res, next) => {
    let log_statement = 
    `${new Date.getISOString()} `
    `${req.method} ${req}`
    next();
}


module.exports = errorLogger