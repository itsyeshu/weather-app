const setLocales = (req, res, next) => {
    const site = `${req.protocol}://${req.headers.host}`;
    res.locals = {
        "dev" : false,
        "site" : site,
    }
    res.locals.static = (name) => (site + name);

    next();
}


module.exports = setLocales