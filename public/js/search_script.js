"use-strict";
const search_input = document.getElementById("search_input");
let search_timeout = undefined;

const searchCityResults = (search_input) => {
    const URL = (name) => `/api/v1/search/?city=${name}`;
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
    }

    const parseData = (results_element, data) => {
        if(!data.error){
        results_element.innerHTML = `
            <div class="box_content" style="margin: calc(-0.5 * var(--signature-spacing, 12px)) 0 calc(0.5 * var(--signature-spacing, 12px)) 0;"><span style="width:auto;white-space: nowrap;margin-right: calc(0.5 * var(--signature-spacing, 12px));font-size: 11px;">Results for '${data.query.city}' (${data.count})</span></div>
        `;}
        const getCountryFlagUrl = (country_code) => `https://open-meteo.com/images/country-flags/${country_code.toLowerCase()}.svg`;
        if(data.error){
            const result_element = document.createElement("div");
            results_element.innerHTML = "";
            result_element.classList.add("search_result");
            result_element.style = "pointer-events: none;";
            result_element.innerHTML = `
            <div class="city_box flex">
                <div class="city_name_box flex_grow">
                    <h2>${data.error}</h2>
                    <p class="simpl_p">${data.message}</p>
                </div>
                <div class="weather_icon" style="background:transparent;margin-left:var(--signature-spacing, 12px);">
                    <img src="/public/img/error.gif" alt="Error occured">
                </div>
            </div>`;
            results_element.appendChild(result_element);
            return;
        }
        data.data.results.forEach((result, index) => {
            const city = result.city;
            const result_element = document.createElement("a");
            result_element.classList.add("search_result");
            result_element.href = `/search/?city=${data.query.city}&counter=${index+1}&timezone=${DEFAULT_TIME_ZONE}`;
            result_element.innerHTML = `
                <div class="city_name_box">
                    <h2>
                        ${city.name}
                        <span class="country_code" title="${city.state}, ${city.country}"><img src="${getCountryFlagUrl(city.country_code)}" alt="${city.country_flag}"></span>
                    </h2>
                    <p class="simpl_p">${ result.lat }, ${ result.lon } • ${city.state}, ${city.country_code}</p>
                </div>`;
            results_element.appendChild(result_element);
            // if(index == 0) setTimeout(result_element.focus(), 1000); // Interrupts typing
        });
    }
    const addLoading = (el, city_name) => {
        el.innerHTML = "";
        const loading = document.createElement("div");
        loading.classList.add("search_result");
        loading.style = "pointer-events: none;";
        loading.innerHTML = `
            <div class="city_name_box">
                <h2>
                    Loading 
                    <span><img src="/public/img/loading-transparent.gif" alt="" style="display:inline-block;width: 18px;height: 18px;vertical-align: baseline;"></span>
                </h2>
                <p class="simpl_p">Loading cities with name "${city_name}"</p>
            </div>`;
        el.appendChild(loading);
    }
    const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const main = async (name) => {
        name = sanitizeName(name);
        if(name){
            const el = document.getElementById("search_results_cont");
            addLoading(el, name);
            const results = await searchCity(name);
            parseData(el, results);
        }else{
            const results_element = document.getElementById("search_results_cont");
            results_element.innerHTML = "";
        }
    }
    if(search_timeout) clearTimeout(search_timeout);
    search_timeout = setTimeout(()=>{main(search_input)}, 200);
}

search_input && ["input"].forEach(eventType => search_input.addEventListener(eventType, e => {
    const search_input = e.target.value;
    searchCityResults(search_input);
}));

const bulkSearchCityResults = (inputs) => {
    // console.log(inputs);
    const URL = (city_names, city_counters) => `/api/v1/weather/bulk?city_names=${city_names.join(",")}&city_counters=${city_counters.join(",")}`;
    const promise = fetch(URL(inputs.map(result => result.city_name), inputs.map(result => result.counter)));
    promise.then(data => data.json()).then(data => {
        // console.log(data.data.results);
        const results_element = document.getElementById("city_card_container");
        const results = data.data.results;
        results.forEach((city, index) => {
            const result = inputs.filter(input => city.id == input.id)[0];
            city.tabs.unshift({
                "name" : result.label.toString(),
                "class" : ""
            });
        });
        const innerHTML = results.map(city => (`
        <div class="city_card">
            <div class="city_card_cont">
                <div class="is_day_background">
                    <img src="/public/img/${city.weather.is_day?"day_image.jpg":"night_image.jpg"}" alt="${city.weather.is_day?"Day":"Night"}" style="display:block;width:100%;height:auto;">
                    <div class="is_day_overlay"></div>
                </div>
                <a href="/search/?city=${ city.query.city }&counter=${ city.query.counter }&timezone=${ DEFAULT_TIME_ZONE }" class="clean_link">
                    <div class="city_card_main_cont">
                        <div class="box_container hvr">
                            <div class="city_box flex box_content">
                                <div class="city_name_box flex_grow">
                                    <h2>
                                        ${ city.name }
                                        <span class="country_code" title="${ city.city.state }, ${ city.city.country }">
                                            <img src="https://open-meteo.com/images/country-flags/${ city.city.country_code.toLowerCase() }.svg" alt="${ city.city.country_code }">
                                        </span>
                                    </h2>
                                    <p class="simpl_p">
                                        ${ city.lat }, ${ city.lon } • ${ city.city.state }, ${ city.city.country_code }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="box_container">
                            <div class="box_content" style="margin:calc(-0.5 * var(--signature-spacing, 12px)) 0 var(--signature-spacing, 12px) 0;">
                                ${ city.tabs.map(tab => "<div class='tab "+tab.class+"'>"+tab.name+"</div>").join("") }
                            </div>
                        </div>
                        <div class="box_content flex">
                            <div class="temperature_box flex flex_grow">
                                <div class="main_temp">
                                    <h1>${ city.weather.temperature }</h1>
                                </div>
                                <div class="main_temp_scales">
                                    <div class="main_temp_overlay"></div>
                                    <div class="main_temp_scale">${ city.weather.temperature_unit }</div>
                                    <div class="main_temp_scale ">${ city.weather.weather.desc }</div>
                                </div>
                            </div>
                            <div class="weather_icon" title="${ city.weather.weather.desc }">
                                <img src="https://openweathermap.org/img/wn/${ city.weather.weather.icon }@2x.png" alt="${ city.weather.weather.desc }">
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div class="flex" style="margin-top:12px;">
                <a href="/search/?city=${ city.query.city }&counter=${ city.query.counter }&timezone=${ DEFAULT_TIME_ZONE }" class="btn_sq btn_opt" style="background:var(--header-background-color);fill:var(--header-font-color);">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path xmlns="http://www.w3.org/2000/svg" d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z"/></svg>
                </a>
                <hr class="vr_90" style=" width: 0; height: 24px; margin-left: 8px; padding-left: 8px; " />
                <button class="simpl_btn btn_sq btn_opt remove_speedlist hvr" hvr="Remove from Speed-list" data-id="${ city.id }">
                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" style="padding:1px;"><path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path></svg>
                </button>
            </div>
        </div>
        `));
        if(results_element)results_element.innerHTML = innerHTML.join("");
        const remove_btns = document.getElementsByClassName("remove_speedlist");
        for(let btn of remove_btns){
            btn.addEventListener("click", e => {
                const id = parseInt(btn.dataset.id);
                const dialog = document.getElementById("loading_dialog_remove_speedlist");
                if(!confirm("Are you sure you want to remove this city from your speedlist?", "Remove City")){
                    return;
                }
                dialog.showModal();
                setTimeout(() => {
                    const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
                    DB_transaction.onsuccess = (e) => {
                        const db = e.target.result;
                        const transaction = db.transaction(OBJ_STORE_NAME, "readwrite");
                        const store = transaction.objectStore(OBJ_STORE_NAME);
                        const request = store.index("id").get(id);
                        // console.log(request);
                        request.onsuccess = (e) => {
                            const speed_list_data = e.target.result;
                            if(speed_list_data == undefined){
                                btn.parentNode.parentNode.remove();
                                if(results_element.children.length == 0){
                                    results_element.innerHTML = `
                                    <div class="city_card">
                                        <div class="city_card_cont">
                                            <div class="city_card_main_cont">
                                                <div class="box_container hvr">
                                                    <div class="city_box flex box_content">
                                                        <div class="city_name_box flex_grow">
                                                            <h2>
                                                                List is empty
                                                            </h2>
                                                            <p class="simpl_p">
                                                                Search & add a city to get started
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="box_content flex">
                                                    <div class="temperature_box flex flex_grow">
                                                        <div class="main_temp">
                                                            <h1 style="height:64px;width:64px;text-align:center;font-style:italic;opacity:0.6;">!!!!</h1>
                                                        </div>
                                                    </div>
                                                    <div class="weather_icon" title="Loading ..." style="padding: 14px;box-sizing: border-box;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="currentColor"><path xmlns="http://www.w3.org/2000/svg" d="M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `;
                                }
                                dialog.close();
                                return;
                            }
                            const delete_request = store.delete(speed_list_data.timestamp);
                            delete_request.onsuccess = (e) => {
                                btn.parentNode.parentNode.remove();
                                if(results_element.children.length == 0){
                                    results_element.innerHTML = `
                                    <div class="city_card">
                                        <div class="city_card_cont">
                                            <div class="city_card_main_cont">
                                                <div class="box_container hvr">
                                                    <div class="city_box flex box_content">
                                                        <div class="city_name_box flex_grow">
                                                            <h2>
                                                                List is empty
                                                            </h2>
                                                            <p class="simpl_p">
                                                                Search & add a city to get started
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="box_content flex">
                                                    <div class="temperature_box flex flex_grow">
                                                        <div class="main_temp">
                                                            <h1 style="height:64px;width:64px;text-align:center;font-style:italic;opacity:0.6;">!!!!</h1>
                                                        </div>
                                                    </div>
                                                    <div class="weather_icon" title="Loading ..." style="padding: 14px;box-sizing: border-box;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="currentColor"><path xmlns="http://www.w3.org/2000/svg" d="M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `;
                                }
                                dialog.close();
                            }
                            delete_request.onerror = (e) => {
                                // console.log(e);
                                alert("Failed to remove city from speedlist", "Error");
                                dialog.close();
                            }
                        }
                        request.onerror = (e) => {
                            // console.log(e.error);
                            alert("Failed to remove city from speedlist", "Error");
                            dialog.close();
                        }
                    }
                    DB_transaction.onerror = (e) => {
                        // console.log(e.error);
                        alert("Failed to remove city from speedlist", "Error");
                        dialog.close();
                    }
                }, 1000);
            }, );
        }
    }).catch(e => {
        // console.log(e);
    })
}

const initialLoad = async () => {
    const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
    DB_transaction.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction(OBJ_STORE_NAME, "readonly");
        try{
            const store = transaction.objectStore(OBJ_STORE_NAME);
            const request = store.getAll();
            request.onsuccess = (e) => {
                const speed_list = e.target.result;
                const pre_result_container = document.getElementById("city_card_container");
                if(speed_list.length > 0){
                    const innerHTML = speed_list.map(city => `
                    <div class="city_card">
                        <div class="city_card_cont">
                            <div class="is_day_background">
                                <div class="is_day_overlay" style="background:linear-gradient(203.11deg, var(--box-background-color) 25%, transparent 50%);"></div>
                            </div>
                            <div class="city_card_main_cont">
                                <div class="box_container hvr">
                                    <div class="city_box flex box_content">
                                        <div class="city_name_box flex_grow">
                                            <h2>
                                                ${ city.name }
                                            </h2>
                                            <p class="simpl_p">
                                                <span style="display:block;width:120px;height:24px;"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="box_container">
                                    <div class="box_content" style="margin:calc(-0.5 * var(--signature-spacing, 12px)) 0 var(--signature-spacing, 12px) 0;">
                                        <div class="tab">${ city.label }</div>
                                        <div class="tab" style="width:80px;height:20px;opacity:0.6;vertical-align:bottom;"></div>
                                    </div>
                                </div>
                                <div class="box_content flex">
                                    <div class="temperature_box flex flex_grow">
                                        <div class="main_temp">
                                            <div style="height:60px;width:64px;"></div>
                                        </div>
                                        <div class="main_temp_scales">
                                            <div class="main_temp_overlay"></div>
                                            <div class="main_temp_scale"></div>
                                            <div class="main_temp_scale" style="width:40px;"></div>
                                        </div>
                                    </div>
                                    <div class="weather_icon" title="Loading ...">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex" style="margin-top:12px;">
                            <div class="btn_sq btn_opt" style="background:var(--header-background-color);"></div>
                            <hr class="vr_90" style=" width: 0; height: 24px; margin-left: 8px; padding-left: 8px; " />
                            <div class="btn_sq btn_opt" style="flex-shrink:0;width:44px;height:44px;background: var(--background-color);border-radius:24px;"></div>
                        </div>
                    </div>
                    `);
                    pre_result_container.innerHTML = innerHTML.join("");
                    bulkSearchCityResults(speed_list);
                }else{
                    // console.log("No results found");
                    pre_result_container.innerHTML = `
                    <div class="city_card">
                        <div class="city_card_cont">
                            <div class="city_card_main_cont">
                                <div class="box_container hvr">
                                    <div class="city_box flex box_content">
                                        <div class="city_name_box flex_grow">
                                            <h2>
                                                List is empty
                                            </h2>
                                            <p class="simpl_p">
                                                Search & add a city to get started
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="box_content flex">
                                    <div class="temperature_box flex flex_grow">
                                        <div class="main_temp">
                                            <h1 style="height:64px;width:64px;text-align:center;font-style:italic;opacity:0.6;">!!!!</h1>
                                        </div>
                                    </div>
                                    <div class="weather_icon" title="Loading ..." style="padding: 14px;box-sizing: border-box;">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="currentColor"><path xmlns="http://www.w3.org/2000/svg" d="M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
        }catch(e){
            // console.log(e);
        }

    }
    search_input && setTimeout(() => {search_input.focus();}, 0);
}

document.addEventListener("DOMContentLoaded", () => {
    initialLoad();
});