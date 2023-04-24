const DEFAULT = require("./constants");
const searchAPIReducer = require(DEFAULT.REDUCER_DIR + "/search");

const searchAPIController = async (req, res) => {
    const city_name = req.query.city || "";
    if(city_name === ""){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "error": "Bad Request",
            "message": "City name is required",
            "data": {
                "results": []
            },
            "count": 0
        });
    }
    const lang = req.query.lang;
    const limit = parseInt(req.query.limit) || DEFAULT.DEFAULT_CITY_LIMIT;
    if (limit < 1){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "error": "Bad Request",
            "message": "Limit must be a positive integer",
            "data": {
                "results": []
            },
            "count": 0
        });
    }
    try{
        const data = await searchAPIReducer.fetchCitiesFromName(city_name, limit, lang);
        if(data.error){
            return res.status(200).send({
                "status": "failed",
                "statusCode": data.statusCode,
                "query": {
                    "city": city_name,
                    "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                    "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
                },
                "error": data.error,
                "message": data.message,
                "data": {
                    "results": []
                },
                "count": 0
            });
        }
        const {data:city_array, count} = data;
        return res.status(200).send({
            "status": "success",
            "statusCode": 200,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "message": "Success",
            "data": city_array,
            "count": count
        });
    }catch(err) {
        return res.status(200).send({
            "status": "failed",
            "statusCode": 500,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "error": "Internal Server Error",
            "message": `${err.message}`,
            "data": {
                "results": []
            },
            "count": 0
        })
    };
}

module.exports = {
    searchAPIController,
};