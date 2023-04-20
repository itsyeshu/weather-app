"use-strict";
var geocoder;
const html = document.documentElement;
const gps_button = document.getElementById("gps_button");
const toggle_theme_button = document.getElementById("toggle_theme_button");
const gps_info_dialog = document.getElementById("gps_info_dialog");

const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

var dark_theme;

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

function change_to_theme(theme) {
    const DARK_THEME_COLOR = "#394d56";
    const LIGHT_THEME_COLOR = "#327648";

    const theme_color = theme?DARK_THEME_COLOR:LIGHT_THEME_COLOR;
    document.querySelector("meta[name=theme-color]").setAttribute("content", theme_color);

    theme?html.classList.add("theme-dark"):html.classList.remove("theme-dark");
    toggle_theme_button.setAttribute("hvr", !theme?"Light theme":"Dark theme");
    
    const dark_theme_path = document.getElementById("path_dark_theme");
    const light_theme_path = document.getElementById("path_light_theme");
    const path_from = document.getElementById("path_theme");

    const path_to = !theme?light_theme_path:dark_theme_path;
    if(path_from && path_to) path_from.setAttribute("d", path_to.getAttribute("d"));

    dark_theme = theme;

    localStorage.setItem("dark_theme", theme);
}

toggle_theme_button && toggle_theme_button.addEventListener("click", e => {
    dark_theme = !dark_theme;
    change_to_theme(dark_theme);
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
    dark_theme = html.classList.contains("theme-dark");
    const clock = document.querySelector(".clock");
    clock && setInterval(function(){ animate_clock(clock, new Date(new Date().toLocaleString('en-US', { timeZone : clock.dataset.timezone || "Asia/Kolkata" })));}, 1000);
}

window.addEventListener("DOMContentLoaded", initialize);