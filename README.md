# Weather web-app [ [Live demo](http://weather-app.itsyeshu.me) ]
Get live weather updates for your city & locality.
This Web-app uses a proxy web-server to use `Open-Meteo`'s API, to hide API-key from requests and using CORS to control the cross-origin access.

### Things you can do
* ✅ Check live weather with name of your city
* ✅ Dedicated API & Interface
    - Try [ [Weather API](http://weather-app.itsyeshu.me/api-docs) ]
* ✅ All private
* ✅ Use GPS co-ordinates to get weather updates near you
* ✅ Available in different themes (Light / Dark)
* ✅ As an Open-source project, fork it, modify it, and make a pull request
* ✅ Dynamic open-graph Image preview on social-media sites

### Nice to haves
* ✅ Personalization
* ✅ Speed-list

# *How to use* locally
1. Rename `.env_demo` to `.env` and add related secret-keys.
    - `NODE_ENV`
        - Used to control the running - environment of the application.
        - Options : `development`, `staging` and `production`
        - For local development, keep it on `development`
   - `CHROMIUM_EXE_PATH` - `Optional`
       - Path of chromium browser locally. Used by `Puppeteer` to render *Open-Graph preview image*.
           > NOTE :
           > `Puppeteer` has its own head-less chromium browser, and uses it to render website.
           > Only in-case you need better performance, you should use this to add any *chromium-based* (Chrome, Opera, Edge) browser path.
       - [Learn more](https://pptr.dev/api/puppeteer.page.screencast) about `puppeteer` screenshot API.
    - `REVERSE_GEO_API_KEY`
        - Used by app, to get city details (name) from lat-lon from GPS location.
        - The city name and location (lat-lon) details are in-turn used to get weather-details.
3. Install `node` dependencies
    ```
    npm install
    ```
4. Start development server
    ```
    npm run dev
    ```
5. Enjoy the app.
