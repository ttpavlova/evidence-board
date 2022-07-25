import { addElementToDb, addLineToDb, addNoteToDb, clearObjStore } from './indexeddb.js';

let importInput = document.getElementById("import-input");

importInput.addEventListener("click", function(e) {
    // prevent displaying the "Open" window if the user hasn't agreed to import a file
    if (!confirmInput()) {   
        e.preventDefault();  
    }
});

importInput.addEventListener("change", function() {
    importFile(this);
});

function confirmInput() {
    let confirm = window.confirm("Are you sure you want to open a new scheme? All current items will be deleted and the page will be reloaded");

    if (confirm) {
        return true;
    }
}

function importFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    let result = "";

    reader.onload = function() {
        result = reader.result;
        writeNewData(result);
        // console.log(reader.result);
    }

    reader.onerror = function() {
        result = reader.result;
        // console.log(reader.result);
    }
}

function writeNewData(result) {
    let newItemsObj = checkJSONData(result);

    if (!checkJSONData(result) || !checkFileData(newItemsObj)) {
        alert("Error: File data is incorrect.");
        return;
    }

    clearDb();

    try {
        addElementsToDb(newItemsObj.elements);
        addLinesToDb(newItemsObj.lines);
        addNotesToDb(newItemsObj.notes);
    } catch {
        alert("Error: Can't add items to Db");
    }

    setTimeout(function() {
        // reload the page
        document.location.reload();
    }, 500);
    
}

function checkJSONData(result) {
    try {
        let json = JSON.parse(result);
        return json;
    } catch {
        return false;
    }
}

function checkFileData(obj) {
    if ((obj.elements == undefined) || (obj.lines == undefined) || (obj.notes == undefined)) {
        return false;
    }

    return true;
}

function clearDb() {
    clearObjStore("elements");
    clearObjStore("lines");
    clearObjStore("notes");
}

function addElementsToDb(obj) {
    for (let i = 0; i < obj.length; i++) {
        addElementToDb(obj[i].id, obj[i].title, obj[i].img, obj[i].x, obj[i].y);
    }
}

function addLinesToDb(obj) {
    for (let i = 0; i < obj.length; i++) {
        addLineToDb(obj[i].id, obj[i].title, obj[i].elemId1, obj[i].elemId2, obj[i].x1, obj[i].y1, obj[i].x2, obj[i].y2);
    }
}

function addNotesToDb(obj) {
    for (let i = 0; i < obj.length; i++) {
        addNoteToDb(obj[i].id, obj[i].title, obj[i].text, obj[i].x, obj[i].y);
    }
}

export { importFile };