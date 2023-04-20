"use-strict";
const search_input = document.getElementById("search_input");
let search_timeout = undefined;
const searchCityResults = (search_input) => {
    const URL = (name) => `/api/v1/search/?city=${name}&lang=dj`;
    const searchCity = async (name) => {
        try{
            const data = await fetch(URL(name));
            const results = await data.json();
            return results;
        }catch(e){
            return {
                "status": "failed",
                "error" : "Unexpected Error",
                "message": e.message,
                "data": {
                    "results": []
                }
            };
        }
        return {
            "status": "failed",
            "error" : "Unknown Error",
            "message": "Unknown error occured, please try again later",
            "data": {
                "results": []
            }
        };
    }

    const parseData = (data) => {
        const results_element = document.getElementById("search_results_cont");
        results_element.innerHTML = `
            <div class="box_content" style="margin: calc(-0.5 * var(--signature-spacing, 12px)) 0 calc(0.5 * var(--signature-spacing, 12px)) 0;"><span style="width:auto;white-space: nowrap;margin-right: calc(0.5 * var(--signature-spacing, 12px));font-size: 11px;">Results for '${data.query.city}'</span></div>
        `;
        const getCountryFlagUrl = (country_code) => `https://open-meteo.com/images/country-flags/${country_code.toLowerCase()}.svg`;
        if(data.error){
            const result_element = document.createElement("div");
            result_element.classList.add("search_result");
            result_element.innerHTML = `
            <div class="city_box">
                <div class="city_name_box flex_grow">
                    <h2>
                        Error : ${data.error}
                    </h2>
                    <p class="simpl_p">${data.message}</p>
                </div>
            </div>`;
            results_element.appendChild(result_element);
            return;
        }
        data.data.results.forEach((result, index) => {
            const city = result.city;
            const result_element = document.createElement("a");
            result_element.classList.add("search_result");
            result_element.href = `/search/?city=${city.name}&counter=${index+1}&timezone=${DEFAULT_TIME_ZONE}`;

            result_element.innerHTML = `
                <div class="city_name_box">
                    <h2>
                        ${city.name}
                        <span class="country_code" title="${city.state}, ${city.country}"><img src="${getCountryFlagUrl(city.country_code)}" alt="${city.country_flag}"></span>
                    </h2>
                    <p class="simpl_p">19.1602, 77.315 • ${city.state}, ${city.country_code}</p>
                </div>`;
            results_element.appendChild(result_element);
            // if(index == 0) setTimeout(result_element.focus(), 1000); // Interrupts typing
        });
    }
    const main = async (name) => {
        if(name)
        {
            const results = await searchCity(name);
            parseData(results);
        }else{
            const results_element = document.getElementById("search_results_cont");
            results_element.innerHTML = "";
        }
    }
    if(search_timeout) clearTimeout(search_timeout);
    
    search_timeout = setTimeout(()=>{main(search_input)}, 300);
}
search_input && search_input.addEventListener("input", e => {
    const search_input = e.target.value;
    searchCityResults(search_input);
});

const initialLoad = () => {
    search_input && setTimeout(() => {search_input.focus();}, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    initialLoad();
});