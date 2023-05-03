const DEFAULT = require("./constants");
const weatherReducer = require(DEFAULT.REDUCER_DIR + "/weather");


const path = require('path')
const fsSync = require('fs');
const fs = fsSync.promises;

// Chrome and Puppeteer configuration
const isDEV = process.env.NODE_ENV !== 'production';
const puppeteer = require('puppeteer-core');
const ejs = require('ejs');

const weatherController = async (req, res, next) => {
    const city_name = req.query.city;
    const counter = req.query.counter || 1;
    const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
    const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

    if(city_name === ""){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "data" : {},
            "error": "Bad Request",
            "message": "City name is required"
        });
        // return next();
    }

    if(city_name === undefined){
        const lat = req.query.lat || "";
        const lon = req.query.lon || "";

        if(!lat || lat == "" || !lon || lon == "" || isNaN(lat) || isNaN(lon)){
            res.status(200).send({
                "status": "failed",
                "statusCode": 400,
                "data" : {},
                "error": "Bad Request",
                "message": "Latitude and Longitude are required"
            });
            // return next();
        }
        const timezone = req.query.timezone || DEFAULT.DEFAULT_TIME_ZONE;
        const lang = req.query.lang || DEFAULT.DEFAULT_LANG;

        const weather_data = await weatherReducer.getCurrentWeatherDataByLatLon(lat, lon, timezone, lang);
        if(weather_data.error){
            res.send({
                "status": "failed",
                "statusCode": weather_data.statusCode,
                "error": weather_data.error,
                "message": weather_data.message,
                "data": weather_data.data
            });
            // return next();
        }
        res.render('v1/pages/latlon_weather', {
            "data" : weather_data.data
        });
    }

    if(isNaN(counter) || counter < 1){
        return res.status(200).send({
            "status": "failed",
            "statusCode": 400,
            "data" : null,
            "error": "Bad Request",
            "message": "Counter must be a positive number"
        });
        // return next();
    }

    const weather_data = await weatherReducer.getCurrentWeatherData(city_name, counter, timezone, lang);
    if(weather_data.error){
        return res.send({
            "status": "failed",
            "statusCode": weather_data.statusCode,
            "error": weather_data.error,
            "message": weather_data.message,
            "data": weather_data.data
        });
        // return next();
    }
    res.render('v1/pages/weather', {
        "data" : weather_data.data
    });
};

// Dynmaic Weather OG Image helper function
async function generateImage(template, template_data, ss_path) {
    console.log("Loading OG:Image");

    console.log("Checking for File in cache : ", template_data.city.id +".jpg")
    if(fsSync.existsSync(ss_path)){
        image = Buffer.from(fsSync.readFileSync(ss_path));
        console.log("Serving the image from cache");
        return image;
    }

    const puppeteer_options = {
        "args": ["--no-sandbox", "--disable-setuid-sandbox"],
        "executablePath": process.env.CHROMIUM_EXE_PATH,
        "headless": "new"
    };

    console.log("File not found in cache, creating a new one");
    // Render some HTML from the relevant template
    const html = await ejs.renderFile(template, template_data);
    // Launch a new browser
    const browser = await puppeteer.launch(puppeteer_options);
    console.log("HTML rendered & Browser launched")
    // Create a new page
    const page = await browser.newPage();
    console.log("New tab launched")
    console.log("Adding HTML content to the Tab")
    // Set the content to our rendered HTML
    await page.setContent(html, { "waitUntil": "networkidle0" });
    console.log("Added HTML content to the Tab")

    const screenshotBuffer = await page.screenshot({
    //  fullPage: false, // Default
        type: "jpeg",
        clip: {
            x:0,
            y:0,
            width:320,
            height: 196,
        },
        quality: 100,
        path : ss_path
    });
    console.log("Took the screenshot")

    await browser.close();
    console.log("Browser closed")

    return screenshotBuffer;
}

// Dynamic Weather OG Image Controller
dynamicWeatherOGImageController = async (req, res, next) => {
    // console.time("load_time");

    const data = await weatherReducer.getOnlyCurrentWeatherData(
        req.query.city,
        req.query.counter,
        req.query.timezone,
        req.query.lang );
    // console.log(data);
    if(data.error){
        console.log(data.error);
        return res.sendStatus(404);
        // return next();
    }
    // Data updates every 30 min so need to create a new Image every 30 mins
    const current_date = new Date();
    current_date.setMinutes(parseInt(current_date.getMinutes() / 30) * 30);
    const _30_min_format = current_date.toISOString().split(":").join("-").substring(0, 16);

    // Current OG Image cache (Screenshot) Directory
    const current_ss_dir = path.join(__dirname, "..", "..", ".cache", "og-img", _30_min_format);
    let ss_path = path.join(current_ss_dir , data.data.id + ".jpg");

    try{
        if(fsSync.existsSync(current_ss_dir)){
            // console.log("Directory already exists!");
        }else{
            // Deleting older directories from Cache
            const folderToBeDeleted = path.resolve(current_ss_dir, "..")
            // console.log("Folder to be removed : ", folderToBeDeleted);
            if(fsSync.existsSync(folderToBeDeleted)){
                // console.log("Parent directory exists");
                await fs.rm(folderToBeDeleted, { "recursive": true }, (err) => {
                    if(err !== null) console.log("Directory deleted successfully");
                });
            }
            // console.log("Creating directory")
            fsSync.mkdir(current_ss_dir, {"recursive": true}, (err) => {
                if(err) console.log("Error while creating Directory : ", err);
            });
        }
    }catch(e){
        return res.sendStatus(500);
        // return next();
    }

    const img = await generateImage(path.join(__dirname, "..", "..", "views", "v1", "partials", "city_card.ejs"), {
        city : data.data,
        static : res.locals.static,
    }, ss_path);

    if(img === null){
        return res.sendStatus(500);
    }

    res.writeHead(200, {
        'Content-Type': 'image/jpg',
        'Content-Length': img.length,
    });
    res.end(img);
}

module.exports = {
    weatherController,
    dynamicWeatherOGImageController,
};