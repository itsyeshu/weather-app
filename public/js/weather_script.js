const label = document.getElementById('add_label');

const toggle_label = () => {
    let dialog = document.getElementById('add_speedlist_dialog');
    const label_text = document.getElementById('speedlist_label');
    label_text.select();
    label_text.focus();
    if(label_text.value.trim().length > 20){
        alert("Label name should be less than 20 characters");
        label_text.focus();
        return;
    }
    const invalid_chars = ['>', '<', '/'];
    if(label_text.value.trim().split("").map(char => invalid_chars.includes(char)).includes(true)){
        alert("Label name should not contain any of the following characters: " + invalid_chars.join(", "));
        label_text.focus();
        return;
    }
    if(label_text.value.trim() === ""){
        alert("Label name cannot be empty!");
        return;
    }
    dialog.close();
    const label_data = {
        "id" : parseInt(label.dataset.id),
        "timestamp" : new Date().getTime(),
        "name" : label.dataset.name,
        "label" : label_text.value.trim(),
        "city_name" : label.dataset.cityName,
        "counter" : parseInt(label.dataset.cityCounter) || 1,
    }
    label_text.value = "";

    dialog = document.getElementById('loading_dialog_add_speedlist');
    dialog.showModal();
    setTimeout(()=>{
        const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
        DB_transaction.onsuccess = (event) => {
            const db = event.target.result;
            const dialog = document.getElementById('loading_dialog_add_speedlist');

            const result = db.transaction(OBJ_STORE_NAME, "readwrite").objectStore(OBJ_STORE_NAME).add(label_data);
            result.onsuccess = (e) => {
                // console.log("object added successfully")
                // console.log('request.result : ', e.target);
                label.querySelector('path').setAttribute('d', 'M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z');
                label.setAttribute('hvr', 'Added to Speed-list');
                dialog.close();
                const result_element = document.getElementById('tab_container');
                if(result_element.children.length > 0){
                    result_element.children[0].innerHTML = `
                        <span class="tab ">${ label_data.label }</span>
                    ` + result_element.children[0].innerHTML;
                }else{
                    result_element.innerHTML = `
                    <div class="box_content" style="margin:calc(-0.5 * var(--signature-spacing, 12px)) 0 var(--signature-spacing, 12px) 0;">
                        <span class="tab ">${ label_data.label }</span>
                    </div>`;
                }
            }
        }
        DB_transaction.onerror = () => {
            const dialog = document.getElementById('error_dialog');
            dialog.showModal();
        }
    }, 1200);
}

const open_toggle_label = () => {
    const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
    DB_transaction.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(OBJ_STORE_NAME, "readwrite");
        const request = transaction.objectStore(OBJ_STORE_NAME).index("id").get(parseInt(label.dataset.id));
        request.onsuccess = (e) => {
            if(e.target.result === undefined){
                const result_all = db.transaction(OBJ_STORE_NAME, "readonly").objectStore(OBJ_STORE_NAME).getAll();
                result_all.onsuccess = (e) => {
                    const results = e.target.result;
                    if(results.length < SPEED_LIST_LIMIT){
                        // console.log("object doesnot exist locally");
                        const dialog = document.getElementById('add_speedlist_dialog');
                        dialog.showModal();
                        const save_btn = document.getElementById('speedlist_save_btn');
                        save_btn.addEventListener('click', toggle_label);
                    }
                    else{
                        alert("You have reached the limit of speed-lists (" + SPEED_LIST_LIMIT + ").\nPlease remove some speed-lists to add more.");
                    }
                }
            }else{
                // console.log("object already exists")
                const dialog = document.getElementById('loading_dialog_remove_speedlist');
                if(!confirm("This city is in your speed-list.\nDo you want to remove it from your speed-list?")){
                    return;
                }
                dialog.showModal();
                const result = db.transaction(OBJ_STORE_NAME, "readwrite").objectStore(OBJ_STORE_NAME).delete(e.target.result.timestamp);
                result.onsuccess = (e) => {
                    setTimeout(()=>{
                        const result_element = document.getElementById('tab_container');
                        if(result_element.children.length > 0){
                            if(result_element.children[0].length > 1) result_element.children[0].children[0].remove();
                            else result_element.children[0].remove();
                        }
                        // console.log("object removed successfully")
                        // console.log('request.result : ', e.target);
                        label.querySelector('path').setAttribute('d', 'M15 19H3l4.5-7L3 5h12c.65 0 1.26.31 1.63.84L21 12l-4.37 6.16c-.37.52-.98.84-1.63.84zm-8.5-2H15l3.5-5L15 7H6.5l3.5 5-3.5 5z');
                        label.setAttribute('hvr', 'Add to Speed-list');
                        const dialog = document.getElementById('loading_dialog_remove_speedlist');
                        dialog.close();
                    }, 1000);
                }
                result.onerror = (e) => {
                    // console.log("Error : ", e.target.error);
                    dialog.close();
                }
            }
        }
    }
}

label.addEventListener('click', open_toggle_label);

const _init_ = () => {
    const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
    DB_transaction.onsuccess = (event) => {
        const db = event.target.result;
        const objectStore = db.transaction(OBJ_STORE_NAME, "readonly").objectStore(OBJ_STORE_NAME);
        const request = objectStore.index("id").get(parseInt(label.dataset.id));
        request.onsuccess = (e) => {
            if(e.target.result === undefined){
                // console.log("object doesnot exist locally")
                label.querySelector('path').setAttribute('d', 'M15 19H3l4.5-7L3 5h12c.65 0 1.26.31 1.63.84L21 12l-4.37 6.16c-.37.52-.98.84-1.63.84zm-8.5-2H15l3.5-5L15 7H6.5l3.5 5-3.5 5z');
                label.setAttribute('hvr', 'Add to Speed-list');
            }else{
                // console.log("object already exists")
                const obj = e.target.result;
                const result_element = document.getElementById('tab_container');
                if(result_element.children.length > 0){
                    result_element.children[0].innerHTML = `
                        <span class="tab ">${ obj.label }</span>
                    ` + result_element.children[0].innerHTML;
                }else{
                    result_element.innerHTML = `
                    <div class="box_content" style="margin:calc(-0.5 * var(--signature-spacing, 12px)) 0 var(--signature-spacing, 12px) 0;">
                        <span class="tab ">${ obj.label }</span>
                    </div>`;
                }
                label.querySelector('path').setAttribute('d', 'M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z');
                label.setAttribute('hvr', 'Remove from Speed-list');
            }
        }
        request.onerror = (e) => {
            // console.log("Error : ", e.target.error);
        }
    }
    DB_transaction.onerror = (event) => {
        // console.log("Error while accessing objectStore", event.target.error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    _init_();
});