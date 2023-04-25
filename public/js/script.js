"use-strict";
const gps_button = document.getElementById("gps_button");
const toggle_theme_button = document.getElementById("toggle_theme_button");
const gps_info_dialog = document.getElementById("gps_info_dialog");

const SPEED_LIST_LIMIT = 4;

const DB_NAME = "speed_list";
const DB_VERSION = 2;
const OBJ_STORE_NAME = "v1";
const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";


gps_button && gps_button.addEventListener("click", e => {
    const success_function = (e) => {
        try {
            const { latitude:lat, longitude:lon } = e.coords;
            const URL = (lat, lon) => `/search/?lat=${lat}&lon=${lon}&timezone=${DEFAULT_TIME_ZONE}`;
            window.location.href = URL(lat, lon);
        } catch (e) {
            // console.log(e);
        }
    }
    const error_function = (e) => {
        alert(e.message);
        end_function(e);
    }
    const end_function = (e) => {
        gps_info_dialog.close();
    }
    const main = (e) => {
        navigator.geolocation.getCurrentPosition(success_function, error_function, {
            enableHighAccuracy: true,
            timeout: 5000
        });
        gps_info_dialog.showModal();
    }
    main(e);
});

function toggle_theme(_theme) {
    change_to_theme(_theme=="DARK"?"LIGHT":"DARK");
}

function change_to_theme(_theme) {
    const theme = _theme=="DARK"?true:false;
    dark_theme = _theme;
    localStorage.setItem("dark_theme", _theme);

    const DARK_THEME_COLOR = "#394d56";
    const LIGHT_THEME_COLOR = "#327648";

    const theme_color = theme?DARK_THEME_COLOR:LIGHT_THEME_COLOR;
    document.querySelector("meta[name=theme-color]").setAttribute("content", theme_color);

    theme?html.classList.add("theme-dark"):html.classList.remove("theme-dark");

    const dark_theme_path = document.getElementById("path_dark_theme");
    const light_theme_path = document.getElementById("path_light_theme");
    const path_from = document.getElementById("path_theme");

    const path_to = !theme?dark_theme_path:light_theme_path;
    if(path_from && path_to) path_from.setAttribute("d", path_to.getAttribute("d"));
    toggle_theme_button.setAttribute("hvr", theme?"Switch to Light theme":"Switch to Dark theme");
}

toggle_theme_button && toggle_theme_button.addEventListener("click", e => {
    toggle_theme(dark_theme);
});

function initialize() {
    const animate_clock = (clock, date) =>{
        const [second_hand, minute_hand, hour_hand] = clock.querySelectorAll(".clock_hand");
        const second = date.getSeconds();
        const minute = date.getMinutes();
        const hour = date.getHours() % 12;
        if(hour >= 12 || hour <= 0) hour_hand.style.transition = "none";
        else  hour_hand.style.transition = "";
        if(minute >= 59 || minute <= 0) minute_hand.style.transition = "none";
        else minute_hand.style.transition = "";
        if(second >= 59 || second <= 0) second_hand.style.transition = "none";
        else second_hand.style.transition = "";

        hour_hand.style.transform = "rotate(" + (hour / 12 * 360) + "deg)";
        minute_hand.style.transform = "rotate(" + (minute / 60 * 360 + 360) + "deg)";
        second_hand.style.transform = "rotate(" + (second / 60 * 360) + "deg)";
    }
    const clocks = document.querySelectorAll(".clock");
    clocks && clocks.length && setInterval(function(){ clocks.forEach(clock => {animate_clock(clock, new Date(new Date().toLocaleString('en-US', { timeZone : clock.dataset.timezone || "Asia/Kolkata" })))})}, 1000);
    setTimeout(()=>{html.classList.add("loaded")}, 1000);
    change_to_theme(dark_theme);
}

const DB_init = (DB_NAME, DB_VERSION, OBJ_STORE_NAME) => {
    const DB_transaction = indexedDB.open(DB_NAME, DB_VERSION);
    DB_transaction.onupgradeneeded = (event) => {
        const db = event.target.result;
        if(db.objectStoreNames.contains(OBJ_STORE_NAME)){
            // console.log("Object store '" + OBJ_STORE_NAME + "' already exists");
            db.deleteObjectStore(OBJ_STORE_NAME);
        }
        if(db.objectStoreNames.contains("city_label")){
            // console.log("Object store '" + "city_label" + "' already exists");
            db.deleteObjectStore("city_label");
        }
        objectStore = db.createObjectStore(OBJ_STORE_NAME, {keyPath: "timestamp"});
        objectStore.createIndex("id", "id", {unique: true});
        objectStore.createIndex("label", "label", {unique: false});
        objectStore.createIndex("name", "name", {unique: false});
        objectStore.createIndex("timestamp", "timestamp", {unique: true});
        objectStore.createIndex("city_name", "city_name", {unique: false});
        objectStore.createIndex("counter", "counter", {unique: false});
        // console.log("Object store created : ", objectStore);
    }
    DB_transaction.onerror = (event) => {
        // console.log("Error : ", event.target.errorCode);
    }
    return DB_transaction;
}


window.addEventListener("DOMContentLoaded", initialize);