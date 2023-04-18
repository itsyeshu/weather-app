const express = require('express');
const router = express.Router();

const weatherController = require("../controllers/v1/weather");

router.get('/', async function(req, res) {
    res.render('pages/search', {});
});

module.exports = router;