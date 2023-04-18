const express = require("express");
const router = express.Router();

const apiRoutes = {
    v1: require("./v1/router"),
}

router.use('/v1', apiRoutes.v1);

module.exports = router;