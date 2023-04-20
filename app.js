const express = require('express');
const Path = require('path')
const app = express();

// Routes
const apiRoutes = require("./api/router")
const searchRoutes = require("./routes/search")
const weatherRoutes = require("./routes/weather")

// Load .env variables
require('dotenv').config()

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set Public folder for static files
app.use('/public', express.static(Path.join(__dirname, 'public')))

// Site //

// API endpoint
app.use('/api', apiRoutes);

// Search page
app.use('/', searchRoutes);

// Weather page
app.use('/search', weatherRoutes);

// Index page
app.get('/info', (req, res) => {
    res.status(203).send("<h1>Home page</h1>")
})

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

