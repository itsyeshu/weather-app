const express = require('express');
const Path = require('path')
const app = express();

// Routes
const Routes = require("./routes/router")

// Load .env variables
require('dotenv').config()

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set Public folder for static files
app.use('/public', express.static(Path.join(__dirname, 'public')))

// Site //
app.use('/', Routes);

// about page
app.use(function(req, res, error) {
    res.render('v1/pages/error_page', {
        "error_code": "HTTP " + 404,
        "error": "Resources not found",
        "message": "Make sure you have entered the correct URL",
    });
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});