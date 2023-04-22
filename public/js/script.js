"use-strict";
const html = document.documentElement;
const gps_button = document.getElementById("gps_button");
const toggle_theme_button = document.getElementById("toggle_theme_button");
const gps_info_dialog = document.getElementById("gps_info_dialog");

const DB_NAME = "v1";
const SPEED_LIST_LIMIT = 6;
const DB_VERSION = 1;
const OBJ_STORE_NAME = "city_label";
const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

var dark_theme = "LIGHT";

gps_button && gps_button.addEventListener("click", e => {
    const success_function = (e) => {
        try {
            const { latitude:lat, longitude:lon } = e.coords;
            const URL = (lat, lon) => `/search/?lat=${lat}&lon=${lon}&timezone=${DEFAULT_TIME_ZONE}`;
            window.location.href = URL(lat, lon);
        } catch (e) {
            console.log(e);
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

    // console.log("Saved to localStorage : ", localStorage.getItem("dark_theme"));
    // console.log("Changed to theme : ", theme?"Dark":"Light");
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
    if(localStorage.getItem("dark_theme") === null) {
        dark_theme = html.classList.contains("theme-dark")?"DARK":"LIGHT";
        localStorage.setItem("dark_theme", dark_theme?"DARK":"LIGHT");
    }else{
        dark_theme = localStorage.getItem("dark_theme");
    }
    change_to_theme(dark_theme);
    const clocks = document.querySelectorAll(".clock");
    clocks && clocks.length && setInterval(function(){ clocks.forEach(clock => {animate_clock(clock, new Date(new Date().toLocaleString('en-US', { timeZone : clock.dataset.timezone || "Asia/Kolkata" })))})}, 1000);
}

const DB_init = (DB_NAME, DB_VERSION, OBJ_STORE_NAME) => {
    const DB_transaction = indexedDB.open(DB_NAME, DB_VERSION);
    DB_transaction.onupgradeneeded = (event) => {
        const db = event.target.result;
        if(!db.objectStoreNames.contains(OBJ_STORE_NAME)){
            objectStore = db.createObjectStore(OBJ_STORE_NAME, {keyPath: "id"});
            objectStore.createIndex("label", "label", {unique: false});
            objectStore.createIndex("city_name", "city_name", {unique: false});
            objectStore.createIndex("counter", "counter", {unique: false});
            console.log("Object store created : ", objectStore);
        }else{
            console.log("Object store '" + OBJ_STORE_NAME + "' already exists");
        }
    }
    DB_transaction.onerror = (event) => {
        console.log("Error : ", event.target.errorCode);
    }
    return DB_transaction;
}


window.addEventListener("DOMContentLoaded", initialize);