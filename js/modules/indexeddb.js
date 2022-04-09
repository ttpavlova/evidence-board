import { addElementToPage, addLineToPage, addNoteToPage } from './addItemToPage.js';

// indexedDB

var db;

var openRequest = indexedDB.open("db", 5);

openRequest.onupgradeneeded = function(e) {
    var db = e.target.result;
    console.log("running onupgradeneeded");
    // create object stores if they don't exist yet
    if (e.oldVersion < 1) {
        db.createObjectStore("elements", {keyPath: "id"});
        db.createObjectStore("lines", {keyPath: "id"});
        db.createObjectStore("notes", {keyPath: "id"});
    }
};

openRequest.onsuccess = function(e) {
    console.log("running onsuccess");
    db = e.target.result;

    // checks if anything is in db
    readItemsFromDb("elements");
    readItemsFromDb("lines");
    readItemsFromDb("notes");
};

openRequest.onerror = function(e) {
    console.log("onerror!");
    console.dir(e);
};

// add an element to the db
function addElementToDb(id, title, img, x, y) {
    var transaction = db.transaction(["elements"], "readwrite");
    var elements = transaction.objectStore("elements");
    var item = {
        id: id,
        title: title,
        img: img,
        x: x,
        y: y,
        created: new Date().getTime()
    };

    var request = elements.add(item);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {
        // console.log("the element was added to db successfully");
    };
}

// add a line to the db
function addLineToDb(id, title, elemId1, elemId2, x1, y1, x2, y2) {
    var transaction = db.transaction(["lines"], "readwrite");
    var lines = transaction.objectStore("lines");
    var item = {
        id: id,
        title: title,
        elemId1: elemId1,
        elemId2: elemId2,
        x1: parseFloat(x1),
        y1: parseFloat(y1),
        x2: parseFloat(x2),
        y2: parseFloat(y2),
        created: new Date().getTime()
    };

    var request = lines.add(item);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {
        // console.log("the line was added to db successfully");
    };
}

// add a note to the db
function addNoteToDb(id, title, text, x, y) {
    let transaction = db.transaction(["notes"], "readwrite");
    let notes = transaction.objectStore("notes");
    let item = {
        id: id,
        title: title,
        text: text,
        x: x,
        y: y,
        created: new Date().getTime()
    };

    let request = notes.add(item);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {
        // console.log("the element was added to db successfully");
    };
}

// get an item from the db
function getItemFromDb(objectStoreName, key) {
    var transaction = db.transaction([objectStoreName], "readonly");
    var items = transaction.objectStore(objectStoreName);
    let request = items.get(key);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {

        const matching = request.result;

        if (matching !== undefined) {
            // a match was found
            // console.log("a match was found");
            // console.log(request.result);
        }
        else {
            // no match was found
            console.log("no match was found");
        }
    };    
}

// edit the item's value in the db
function editItemInDb(objectStoreName, key, indexName, value) {
    let transaction = db.transaction([objectStoreName], "readwrite");
    let items = transaction.objectStore(objectStoreName);
    let request = items.get(key);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {

        const data = request.result;

        data[indexName] = value;

        let requestUpdate = items.put(data);

        requestUpdate.onerror = function(e) {
            // error
            console.log("error while editing data in db");
        }
        
        requestUpdate.onsuccess = function(e) {
            // success
            // console.log("item in '" + objectStoreName + "' moved, " + "indexName is " + indexName + ", value is " + value);
        }
    }
}

// delete an item from the db
function deleteItemFromDb(objectStoreName, key) {
    let request = db.transaction([objectStoreName], "readwrite")
                    .objectStore(objectStoreName)
                    .delete(key);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("item was deleted successfully from db");
    }
}

// read info from the db
function readItemsFromDb(objectStoreName) {
    // check if there is anything in db
    let request = db.transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
                .openCursor();

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }
            
    request.onsuccess = function(e) {
        const cursor = request.result;
        if (cursor) {
            // store is not empty
            // console.log("preparing to load data");

            if (objectStoreName == "elements") {
                addElementToPage(cursor.key, cursor.value.title, cursor.value.img, cursor.value.x, cursor.value.y);
                console.log("element was created");
            }
            else if (objectStoreName == "lines") {
                addLineToPage(cursor.key, cursor.value.title, cursor.value.elemId1, cursor.value.elemId2, cursor.value.x1, cursor.value.y1, cursor.value.x2, cursor.value.y2);
                console.log("line was created");
            }
            else if (objectStoreName == "notes") {
                addNoteToPage(cursor.key, cursor.value.title, cursor.value.text, cursor.value.x, cursor.value.y);
                console.log("note was created");
            }
            cursor.continue();
        }
        else {
            // store is empty
            console.log("nothing to restore");
        }
        // console.log("data from db was successfully read");
    }
}

// clear object store
function clearObjStore(objectStoreName) {
    let request = db.transaction([objectStoreName], "readwrite").objectStore(objectStoreName).clear();

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("all items were deleted successfully from db");
    }
}

export { addElementToDb, addLineToDb, addNoteToDb, getItemFromDb, editItemInDb, deleteItemFromDb, readItemsFromDb, clearObjStore };