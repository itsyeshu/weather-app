'use-strict';

const html = document.documentElement;


const SPEED_LIST_LIMIT = 4;

const DB_NAME = "speed_list";
const DB_VERSION = 2;
const OBJ_STORE_NAME = "v1";
const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

const DEFAULT_LANG = "en";

let dark_theme = "LIGHT";


if(localStorage.getItem("dark_theme") === null) {
    dark_theme = html.classList.contains("theme-dark")?"DARK":"LIGHT";
    localStorage.setItem("dark_theme", dark_theme);
}else{
    dark_theme = localStorage.getItem("dark_theme");
}
if(dark_theme == "DARK") {
    html.classList.add("theme-dark");
}else{
    html.classList.remove("theme-dark");
}