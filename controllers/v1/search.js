const DEFAULT = require("./constants");
// const searchReducer = require(DEFAULT.REDUCER_DIR +"/search");

const searchController = async function(req, res, next) {
    res.render('v1/pages/search');
    next();
};


module.exports = {
    searchController,
};