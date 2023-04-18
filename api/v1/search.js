const express = require("express");
const router = express.Router();

const DEFAULT = require("./constants");
const searchController = require(`${DEFAULT.DIR}/search`);

router.get('/', async (req, res) => {
    const city_name = req.query.city || "";
    if(city_name === ""){
        return res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            "message": "City name is required"
        });
    }
    const lang = req.query.lang;
    const limit = parseInt(req.query.limit) || DEFAULT.DEFAULT_CITY_LIMIT;
    if (isNaN(limit) || limit < 1){
        return res.status(400).send({
            "status": 400,
            "error": "Bad Request",
            "message": "Limit must be a positive integer"
        });
    }
    try{
        const {data : city_array, count} = await searchController.fetchCitiesFromName(city_name, limit, lang);
        if(count <= 0){
            console.log(`City with name "${city_name}" does not exist`);
            res.status(404).send({
                "status": 404,
                "error": "City not found",
                "message": `City with name "${city_name}" does not exist`
            })
        }
        res.status(200).send({
            "status": 200,
            "message": "Success",
            "data": city_array
        });
    }catch(err) {
        console.log(err);
        res.status(500).send({
            "status": 500,
            "error": "Internal Server Error",
            "message": `${err.message}`
        })
    };
});



module.exports = router;