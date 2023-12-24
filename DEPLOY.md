### Pre-requisites
1. Primary knowledge of `git` and `npm`.
2. For Optional *OG-image* preview, primary knowledge of `puppeteer` is necessary.


# Deployment Instructions
Instructions depend on the Operating System.

## 1. Linux OS
> **Note :**
> I tested these commands on Ubuntu 22.04 LTS, a debian based Distro.
> All other distros have similar commands, so it should work on them. Raise an issue [here](https://github.com/itsyeshu/weather-app/issues/new), if you couldn't start a server on Linux server.

1. Let's first install `git`, `node` and `npm`.
    ```
    sudo apt install git nodejs==18.18.1 npm==10.2.1
    ```
2. Test out the installations of node and npm.
    ```
    node -v && npm -v
    ```
    If this throws an error instead of
    ```
    Node 18.18.1
    npm 10.2.1
    ```
    make sure to refer [NodeJS Documentation](https://nodejs.org/en/download) to download.
3. Clone this repo on server machine.
    ```
    git clone https://github.com/itsyeshu/weather-app.git
    ```
4. Change to recently downloaded working directory.
    ```
    cd weather-app
    ```
5. Install the dependencies for the project.
    ```
    npm install
    ```
6. Next, rename the `.env_demo` file to `.env`.
    ```
    sudo mv .env_demo .env
    ```
7. Change the contents of `.env` with command
    ```
    sudo nano .env
    ```
    to include
    ```
    PORT = 8080

    # Node environment
    NODE_ENV = production

    # [Optional] : Chromium browser path used by puppeteer
    CHROMIUM_EXE_PATH =

    # Get API keys for Free at https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/#about
    REVERSE_GEO_API_KEY =
    ```

8. Adding dynamic *OG-image* is optional.
    1. Download the chrome browser.
        ```
        npx puppeteer browsers install chrome@120.0.6099.109
        ```
    2. This will output the path to the Chrome browser recently downloaded. Copy that path.
    3. Now, install dependencies needed to run on this server.
        ```
        npm run setup
        ```
    4. Check if there any missing dependencies for this browser.
        ```
        ldd <Copied-Chrome-path> | grep not
        ```
    5. Search online on [Debian forum](https://forums.debian.net/) to download these missing packages, if any.
9. Geoapify API is used to get location details from *Lat-Lon* data. API key is necessary to run this functionality.
    Get API keys for Free [here](https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/#about) and add it to `.env` file.
    ```
    REVERSE_GEO_API_KEY = <Your-API-key-here>
    ```
10. Now, run the application server.
    ```
    npm start
    ```
    To keep the server running in background, use this command.
    ```
    nohup npm start &
    ```

## 2. Windows OS

I didn't test on windows.
You could use a `bash CLI` to run these commands on Windows, as is.
Please raise an issue if you find any, [here](https://github.com/itsyeshu/weather-app/issues/new) or I'll appreciate if you could contribute to this project.

---

### Wow, you made it 😊!!
Star 🌟 this project, so it will help in reaching other people like you.
**Thank you for using and contributing to this Project.**