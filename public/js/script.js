"use-strict";
var geocoder;
const html = document.documentElement;
const gps_button = document.getElementById("gps_button");
const toggle_theme_button = document.getElementById("toggle_theme_button");
const gps_info_dialog = document.getElementById("gps_info_dialog");
var dark_theme;

gps_button && gps_button.addEventListener("click", e => {
    const success_function = (e) => {
        try {
            const {latitude:lat, longitude:lon} = e.coords;
            // alert(getAddr(lat, lon));
        } catch (e) {
            console.log(e);
        }
        end_function(e);
    }
    const error_function = (e) => {
        console.log(e);
        end_function(e);
    }
    const end_function = (e) => {
        gps_info_dialog.close();
    }
    // navigator.geolocation.getCurrentPosition(success_function, error_function);
    gps_info_dialog.showModal();
});

function change_to_theme(theme) {
    console.log(dark_theme, theme);
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
    path_from.setAttribute("d", path_to.getAttribute("d"));

    dark_theme = theme;

    // localStorage.setItem("dark_theme", theme);
}

toggle_theme_button && toggle_theme_button.addEventListener("click", e => {
    dark_theme = !dark_theme;
    change_to_theme(dark_theme);
});

const getAddr = (lat, lon) => {
    var latlon = new google.maps.LatLng(lat, lon);
    geocoder.geocode({'latLng': latlon}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
         //formatted address
         alert(results[0].formatted_address)
        //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
        //city data
        alert(city.short_name + " " + city.long_name)


        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}

function initialize() {
    // geocoder = new google.maps.Geocoder();
    // if(localStorage.getItem("dark_theme") && localStorage.getItem("dark_theme") === null) {
        dark_theme = html.classList.contains("theme-dark");
    // }else{
    //     dark_theme = localStorage.getItem("dark_theme");
    // }
    // console.log("Initialize called!")
    // change_to_theme(dark_theme);
}

window.addEventListener("DOMContentLoaded", initialize);