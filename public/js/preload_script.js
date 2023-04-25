'use-strict';

const html = document.documentElement;

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