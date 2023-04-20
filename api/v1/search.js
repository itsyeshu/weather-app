const express = require("express");
const router = express.Router();

const DEFAULT = require("./constants");
const searchController = require(DEFAULT.DIR +"/search");

router.get('/', async (req, res) => {
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
            "message": "City name is required"
        });
    }
    const lang = req.query.lang;
    const limit = parseInt(req.query.limit) || DEFAULT.DEFAULT_CITY_LIMIT;
    if (isNaN(limit) || limit < 1){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "error": "Bad Request",
            "message": "Limit must be a positive integer"
        });
    }
    try{
        const {data, count} = await searchController.fetchCitiesFromName(city_name, limit, lang);
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
                "message": data.message
            });
        }
        return res.status(200).send({
            "status": "success",
            "statusCode": 200,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "message": "Success",
            "data": data
        });
    }catch(err) {
        console.log(err);
        return res.status(200).send({
            "status": "failed",
            "statusCode": 500,
            "query": {
                "city": city_name,
                "lang": req.query.lang || DEFAULT.DEFAULT_LANG,
                "limit": req.query.limit || DEFAULT.DEFAULT_CITY_LIMIT
            },
            "error": "Internal Server Error",
            "message": `${err.message}`
        })
    };
});



module.exports = router;