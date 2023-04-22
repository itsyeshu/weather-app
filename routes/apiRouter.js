const express = require("express");
const router = express.Router();

const apiRoutes = {
    v1: require("./v1/apiRouter"),
    recent: require("./v1/apiRouter"),
}

// Routes
router.get('/', (req, res) => {
    res.status(200).send({
        "message": "Welcome to the Weather App API",
        "api" : {
            "v1": "v1",
            "recent": "recent"
        }
    });
})

// Router
router.use('/v1', apiRoutes.v1);
router.use('/recent', apiRoutes.recent);

module.exports = router;