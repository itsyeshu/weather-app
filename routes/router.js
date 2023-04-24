const express = require("express")
const router = express.Router()


// Routes
const apiRoutes = require("./apiRouter")

const otherRoutes = {
    v1: require("./v1/router"),
    recent: require("./v1/router"),
}

// Router
router.use('/', otherRoutes.recent);
// router.use('/v1', otherRoutes.v1);


// API docs
router.get('/api-docs', (req, res) => {
    res.redirect(301, "https://www.postman.com/itsyeshu-postman/workspace/project/collection/20205366-e23b1304-232c-4491-835b-97f17334b1c0?action=share");
})


// API
router.use('/api', apiRoutes);

module.exports = router;