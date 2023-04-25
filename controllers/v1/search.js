const DEFAULT = require("./constants");
// const searchReducer = require(DEFAULT.REDUCER_DIR +"/search");

const searchController = async function(req, res) {
    res.render('v1/pages/search', {
        data : [],
    });
};


module.exports = {
    searchController,
};