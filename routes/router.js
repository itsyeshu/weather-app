const express = require("express")
const router = express.Router()
const path = require("path")

// Import Routes
const apiRoutes = require("./apiRouter")

const otherRoutes = {
    v1: require("./v1/router"),
    recent: require("./v1/router"),
}


/// Routes
// API
router.use('/api', apiRoutes);
// Router
router.use('/', otherRoutes.recent);


/// PWA
// Service worker
router.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pwa', 'service_worker.js'));
});
// Offline page
router.get('/offline_pwa', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pwa', 'offline.html'));
});

// API docs
router.get('/api-docs', (req, res) => {
    res.redirect(301, "https://www.postman.com/itsyeshu-postman/workspace/project/collection/20205366-e23b1304-232c-4491-835b-97f17334b1c0?action=share");
})


module.exports = router;