const label = document.getElementById('add_label');

const toggle_label = () => {
    const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
    const dialog = document.getElementById('add_speedlist_dialog');
    const label_text = document.getElementById('speedlist_label').value;
    document.getElementById('speedlist_label').value = "";
    if(label_text === ""){
        alert("Please enter valid a label name");
        dialog.showModal();
        return;
    }
    dialog.close();
    const label_data = {
        "id" : parseInt(label.dataset.id),
        "label" : label_text,
        "city_name" : label.dataset.cityName,
        "counter" : parseInt(label.dataset.cityCounter) || 1,
    }
    DB_transaction.onsuccess = (event) => {
        const db = event.target.result;
        const dialog = document.getElementById('loading_dialog_add_speedlist');
        dialog.showModal();
        const result = db.transaction(OBJ_STORE_NAME, "readwrite").objectStore(OBJ_STORE_NAME).add(label_data);
        result.onsuccess = (e) => {
            console.log("object added successfully")
            console.log('request.result : ', e.target);
            label.querySelector('path').setAttribute('d', 'M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z');
            label.setAttribute('hvr', 'Added to Speed-list');
            dialog.close();
            alert("Successfully added to speed-list");
        }
    }
    DB_transaction.onerror = () => {
        const dialog = document.getElementById('error_dialog');
        dialog.showModal();
    }
}

const open_toggle_label = () => {
    const DB_transaction = DB_init(DB_NAME, DB_VERSION, OBJ_STORE_NAME);
    DB_transaction.onsuccess = (event) => {
        const db = event.target.result;
        const result_all = db.transaction(OBJ_STORE_NAME, "readonly").objectStore(OBJ_STORE_NAME).getAll();
        result_all.onsuccess = (e) => {
            const results = e.target.result;
            if(results.length < SPEED_LIST_LIMIT){
                const transaction = db.transaction(OBJ_STORE_NAME, "readwrite");
                const result = transaction.objectStore(OBJ_STORE_NAME).get(parseInt(label.dataset.id));
                result.onsuccess = (e) => {
                    if(e.target.result === undefined){
                        console.log("object doesnot exist locally");
                        const dialog = document.getElementById('add_speedlist_dialog');
                        dialog.showModal();
                        const save_btn = document.getElementById('speedlist_save_btn');
                        save_btn.addEventListener('click', toggle_label);
                    }else{
                        console.log("object already exists")
                        const dialog = document.getElementById('loading_dialog_remove_speedlist');
                        dialog.showModal();
                        const result = db.transaction(OBJ_STORE_NAME, "readwrite").objectStore(OBJ_STORE_NAME).delete(parseInt(label.dataset.id));
                        result.onsuccess = (e) => {
                            console.log("object removed successfully")
                            console.log('request.result : ', e.target);
                            label.querySelector('path').setAttribute('d', 'M15 19H3l4.5-7L3 5h12c.65 0 1.26.31 1.63.84L21 12l-4.37 6.16c-.37.52-.98.84-1.63.84zm-8.5-2H15l3.5-5L15 7H6.5l3.5 5-3.5 5z');
                            label.setAttribute('hvr', 'Add to Speed-list');
                            const dialog = document.getElementById('loading_dialog_remove_speedlist');
                            dialog.close();
                        }
                        result.onerror = (e) => {
                            console.log("Error : ", e.target.error);
                            dialog.close();
                        }
                    }
                }
            }else{
                alert("You have reached the limit of speed-lists (" + SPEED_LIST_LIMIT + ").\nPlease remove some speed-lists to add more.");
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
        const request = objectStore.get(parseInt(label.dataset.id));
        request.onsuccess = (e) => {
            if(e.target.result === undefined){
                console.log("object doesnot exist locally")
                label.querySelector('path').setAttribute('d', 'M15 19H3l4.5-7L3 5h12c.65 0 1.26.31 1.63.84L21 12l-4.37 6.16c-.37.52-.98.84-1.63.84zm-8.5-2H15l3.5-5L15 7H6.5l3.5 5-3.5 5z');
                label.setAttribute('hvr', 'Add to Speed-list');
            }else{
                console.log("object already exists")
                console.log('request.result : ', e.target);
                label.querySelector('path').setAttribute('d', 'M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z');
                label.setAttribute('hvr', 'Added to Speed-list');
            }
        }
        request.onerror = (e) => {
            console.log("Error : ", e.target.error);
        }
    }
    DB_transaction.onerror = (event) => {
        console.log("Error while accessing objectStore", event.target.error);
    }
}

const add_label = () => {

}

const remove_label = () => {
    
}

document.addEventListener('DOMContentLoaded', () => {
    _init_();
});