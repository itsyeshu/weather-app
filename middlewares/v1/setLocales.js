const setLocales = (req, res, next) => {
    // console.log(req.headers);
    const site = `${req.get("x-forwarded-proto") || req.get('X-Forwarded-Proto') || req.proto }://${req.headers.host}`;
    res.locals = {
        "dev" : false,
        "site" : site,
    }
    res.locals.static = (name) => (site + name);

    next();
}


module.exports = setLocales