const express = require('express');
const Path = require('path')
const app = express();

const api = require("./controllers/weather")

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/public', express.static(Path.join(__dirname, 'public')))

// index page
app.get('/', async function(req, res) {
    const city_name = req.query.city
    if(!!!city_name)
        res.status(302).redirect("/?city=Nanded")
    try{
        const counter = req.query.counter || 0;
        const data = await api.getCurrentWeatherData(city_name, counter);
        res.render('pages/index', {
            "data" : data,
        });
    }catch(e){
        res.status(404).render('pages/city_not_found',{
            "error_code" : "Error code : <b>4xccdc234</b>",
            "message" : `City with name "${city_name}" does not exist`
        });
    }
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(8080, () => {});


console.log('Server is listening on port 8080');