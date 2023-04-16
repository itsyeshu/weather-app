"use-strict";
var geocoder;
const gps_button = document.getElementById("gps_button");
const refresh_button = document.getElementById("refresh_button");
const toggle_theme_button = document.getElementById("toggle_theme_button");
const gps_info_dialog = document.getElementById("gps_info_dialog");
gps_button.addEventListener("click", e => {
    const success_function = (e) => {
        try {
            const {latitude:lat, longitude:lon} = e.coords;
            // alert(getAddr(lat, lon));
        } catch (e) {
            console.log(e);
        }
        // end_function(e);
    }
    const error_function = (e) => {
        console.log(e);
        end_function(e);
    }
    const end_function = (e) => {
        gps_info_dialog.close();
    }
    navigator.geolocation.getCurrentPosition(success_function, error_function);
    gps_info_dialog.showModal();
});

toggle_theme_button.addEventListener("click", e => {
    gps_info_dialog.showModal();
});

refresh_button.addEventListener("click", e => {
    return location.reload();
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
    geocoder = new google.maps.Geocoder();
}

window.addEventListener("DOMContentLoaded", initialize);