### Pre-requisites
1. Primary knowledge of `git` and `npm`.
2. For Optional *OG-image* preview, primary knowledge of `puppeteer` is necessary.

# About `.env` variables
1. Environment specific variables are stored in `.env` files.
2. Rename `.env_demo` to `.env`.
3. Brief about the environment variables:
    - `PORT`
        - Application will be accessible on this PORT
        - A number from `8000` to `65535`.
    - `NODE_ENV`
        - Used to control the running - environment of the application.
        - Options : `development`, `staging` and `production`
        - For local development, keep it on `development`
   - `CHROMIUM_EXE_PATH` - `Optional`
       - Keep it empty, as this environment variable is automatically populated by `puppeteer`.
       - If you want to use a different browser, provide the complete path of the executable here.
    - `REVERSE_GEO_API_KEY`
        - Used by app, to get city details (name) from lat-lon from GPS location.
        - The city name and location (Lat-Lon) details are in-turn used to show weather-details.
        - Get API keys for Free at [here](https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/#about).

# Instructions
1. Download `git`, `node` and `npm`, if not already downloaded.
2. Clone / Download this repo.
    ```
    git clone https://github.com/itsyeshu/weather-app.git
    ```
3. Move to working directory and install `node` dependencies
    ```
    cd weather-app && npm install
    ```
4. Run below command to install headless Chrome browser.
    Skip this if you want to use your *own browser* with `CHROMIUM_EXE_PATH` environment variable.
    ```
    npx puppeteer browsers install chrome
    ```
4. Start application server.
    ```
    npm run dev
    ```


---

### Wow, you made it 😊!!
Star 🌟 this project, so it will help in reaching other people like you.
**Thank you for using and contributing to this Project.**