import { addElementToDb, addLineToDb, addNoteToDb, getItemFromDb, editItemInDb, deleteItemFromDb, readItemsFromDb, clearObjStore } from './modules/indexeddb.js';
import { zoom, setZoomValue, getZoomValue } from './modules/zoom.js';
import { Modal } from './modules/Modal.js';
import { ElemModal } from './modules/ElemModal.js';
import { ConnModal } from './modules/ConnModal.js';
import { NoteModal } from './modules/NoteModal.js';
import { Item } from './modules/Item.js';
import { Element } from './modules/Element.js';
import { Connection } from './modules/Connection.js';
import { Note } from './modules/Note.js';

function init() {
    setZoomValue();
}

window.onload = init;

let model = {
    elemNumber: 0,
    connNumber: 0,
    noteNumber: 0,
    elemWidth: 150,
    noteWidth: 150,
    selectedItemId: "", // id of the latest selected item
    selectedType: "", // type (element, line or note) of the latest selected item
    elements: [],
    lines: [],
    notes: [],

    // checks if any item is selected
    ifSelectedItemExists: function() {
        if (this.selectedItemId != "") {
            return true;
        }
        return false;
    },
};

function itemType() {
    this.number = 0; // number of items
    this.numArr = []; // array of numbers corresponding to items' ids
    this.maxNumId = 0; // max number in numArr[]
}

// get id of the latest created item
itemType.prototype.getLatestItemId = function() {
    return this.maxNumId;
}

// count id of the latest created item
itemType.prototype.countLatestItemId = function() {
    if (this.numArr.length > 0) {
        this.maxNumId = Math.max.apply(null, this.numArr);
        console.log("maxNumId = " + this.maxNumId);
    }
}

// update array of ids when new item is created
itemType.prototype.addIdToArray = function(id) {
    this.numArr.push(id.toString());
    // update max id
    this.countLatestItemId();
}

// remove id from array when item is deleted
itemType.prototype.removeIdFromArray = function(id) {
    let index = this.numArr.indexOf(id);

    if (index > -1) {
        this.numArr.splice(index, 1);
    }

    // update max id
    this.countLatestItemId();
}

let elements = new itemType();
let lines = new itemType();
let notes = new itemType();

let view = {
    // disable edit and delete buttons on toolbar when nothing is selected
    setEditDeleteBtnState: function() {
        if (model.ifSelectedItemExists()) {
            editBtn.classList.remove("iconDisabled");
            deleteBtn.classList.remove("iconDisabled");
        }
        else {
            editBtn.classList.add("iconDisabled");
            deleteBtn.classList.add("iconDisabled");
        }
    },

    removeSelection: function(itemId) {
        // the latest selected item
        let itemSelected = document.getElementById(model.selectedItemId);

        // if the item clicked just now is not selected already, we need to remove previous item's selection
        if (model.selectedItemId != itemId) {
            if ((model.selectedType == "elem") || (model.selectedType == "note")) {
                itemSelected.classList.remove("item__selected");
                this.hideIcon();
            }
            else if (model.selectedType == "line") {
                itemSelected.classList.remove("line__selected");
            }
        }

        model.selectedItemId = "";
        model.selectedType = "";
    },

    showIcon: function(itemId) {
        // the element selected now
        let item = document.getElementById(itemId);
        let ideaIcon = item.querySelector(".item__icon");

        ideaIcon.classList.add("icon__visible");
    },

    hideIcon: function() {
        // the latest selected item
        let itemSelected = document.getElementById(model.selectedItemId);
        let ideaIcon = itemSelected.querySelector(".item__icon");
        
        ideaIcon.classList.remove("icon__visible");
    },
}

// modal

let createElemBtn = document.getElementById("create-elem-btn");
let updateElemBtn = document.getElementById("update-elem-btn");

let createConnBtn = document.getElementById("create-conn-btn");
let updateConnBtn = document.getElementById("update-conn-btn");

let createNoteBtn = document.getElementById("create-note-btn");
let updateNoteBtn = document.getElementById("update-note-btn");

// element modal window

let elemModal = new ElemModal("modal-element", "create-elem-btn", "update-elem-btn");
elemModal.setPreviewImgtoBlank();

let newElemBtn = document.getElementById("new-element");

newElemBtn.addEventListener("click", function() {
    elemModal.open();
    elemModal.showCreateBtn();
});

let closeElemModalBtn = document.getElementById("close-btn");

closeElemModalBtn.addEventListener("click", function() {
    elemModal.clear();
    elemModal.setPreviewImgtoBlank();
    elemModal.close();
});

// connection modal window

let connModal = new ConnModal("modal-connection", "create-conn-btn", "update-conn-btn");

let selectFirstElement = document.getElementById("modal-elem1");
let selectSecondElement = document.getElementById("modal-elem2");

let newConnBtn = document.getElementById("new-connection");

newConnBtn.addEventListener("click", function() {
    connModal.open();
    connModal.fillSelectOptions();
    connModal.showCreateBtn();
});

let closeConnModalBtn = document.getElementById("close-btn-connection");

closeConnModalBtn.addEventListener("click", function() {
    connModal.clear();
    connModal.clearSelectOptions();
    connModal.close();
});

// note modal window

let noteModal = new NoteModal("modal-note", "create-note-btn", "update-note-btn");

let newNoteBtn = document.getElementById("new-note");

newNoteBtn.addEventListener("click", function() {
    noteModal.open();
    noteModal.showCreateBtn();
});

let closeNoteModalBtn = document.getElementById("close-btn-note");

closeNoteModalBtn.addEventListener("click", function() {
    noteModal.clear();
    noteModal.close();
});

// Item.prototype.removeSelection = function() {
//     // ...
// }

// draggableItem constructor

function draggableItem() {
    // ...
}

draggableItem.prototype = new Item();

draggableItem.prototype.dragItem = function() {
    // ...
}

// Element.prototype = new draggableItem();

// Element.prototype.selected = false;

// Connection.prototype = new Item();

// Note.prototype = new draggableItem();

// drag and drop items
function dragItem(item, e, itemType) {
    e.preventDefault();
    // current coordinates of the pointer
    let pointerX = e.clientX;
    let pointerY = e.clientY;

    document.onmousemove = itemDrag;
    document.onmouseup = closeDragItem;

    function itemDrag(e) {
        // the distance between previous and new pointer coordinates
        let shiftX = e.clientX - pointerX;
        let shiftY = e.clientY - pointerY;
        // save new pointer coordinates
        pointerX = e.clientX;
        pointerY = e.clientY;
        // set new coordinates of the left-upper corner of an item
        // offsetLeft/offsetTop are X/Y-coordinates for the left/top edge of the draggable item relative to it's container
        item.style.left = item.offsetLeft + shiftX + "px";
        item.style.top = item.offsetTop + shiftY + "px";

        // move all lines connected to the draggable element
        if (itemType == "element") {
            moveLines(item.id);
        }
    }

    function closeDragItem() {
        if (itemType == "element") {
            // edit item's coordinates in db
            editItemInDb("elements", item.id, "x", item.style.left);
            editItemInDb("elements", item.id, "y", item.style.top);

            // lineArr stores identifiers of the lines connected to the draggable element
            let lineArr = getLineIdArr(item.id);
            // updates new coordinates to db after moving an element
            changeLineCoordinates(lineArr);
        }
        else if (itemType == "note") {
            // edit item's coordinates in db
            editItemInDb("notes", item.id, "x", item.style.left);
            editItemInDb("notes", item.id, "y", item.style.top);
        }
        // remove mouse events
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// toolbar

// edit item

let editBtn = document.getElementById("edit-item");
let deleteBtn = document.getElementById("delete-item");

editBtn.addEventListener("click", function() {
    // open modal for editing selected item
    if (model.selectedType == "elem") {
        elemModal.open();
        elemModal.fillInputs();
        elemModal.removeBlankClass();
        elemModal.showUpdateBtn();
    }
    else if (model.selectedType == "line") {
        connModal.open();
        connModal.fillSelectOptions();        
        connModal.fillInputs();
        connModal.disableUnavalilableSelectOptions("modal-elem1", "modal-elem2");
        connModal.disableUnavalilableSelectOptions("modal-elem2", "modal-elem1");
        connModal.showUpdateBtn();
    }
    else if (model.selectedType == "note") {
        noteModal.open();
        noteModal.fillInputs();
        noteModal.showUpdateBtn();
    }
});

deleteBtn.addEventListener("click", function() {
    // delete item
    if (model.selectedType == "elem") {
        deleteElement(model.selectedItemId);
    }
    else if (model.selectedType == "line") {
        deleteConnection(model.selectedItemId);
    }
    else if (model.selectedType == "note") {
        deleteNote(model.selectedItemId);
    }

    model.selectedItemId = "";
    model.selectedType = "";
});

// set edit and delete buttons to disabled by default
view.setEditDeleteBtnState();

// area that doesn't include svg lines
let background = document.getElementById("background");

background.addEventListener("click", function() {
    if (model.selectedItemId != "") {
        view.removeSelection();
    }

    view.setEditDeleteBtnState();
});

// eventlistener to disable option if it's already selected in another dropdown

selectFirstElement.addEventListener("change", function() {
    connModal.disableUnavalilableSelectOptions("modal-elem1", "modal-elem2");
});

selectSecondElement.addEventListener("change", function() {
    connModal.disableUnavalilableSelectOptions("modal-elem2", "modal-elem1");
});

// generates an array of elements' identifiers
// includes all elements connected to the element selected in the dropdown list
function createArrayOfIds(elemId) {

    let idArr = [];
    for (let key in model.lines) {
        if (model.lines[key].elemId1 == elemId) {
            idArr.push(model.lines[key].elemId2);
        }
        else if (model.lines[key].elemId2 == elemId) {
            idArr.push(model.lines[key].elemId1);
        }
    }

    return idArr;
}

// generates an array of elements' titles from an array of elements' identifiers
function createArrayOfTitles(elemId) {
    
    let titleArr = [];

    let idArr = createArrayOfIds(elemId);

    for (let i = 0; i < idArr.length; i++) {
        let title = findObjValueByKeyValue(model.elements, "id", idArr[i], "title");
        titleArr.push(title);
    }

    return titleArr;
}

// gets data from element modal window
function getElementData() {
    let imgPreview = document.getElementById("modal-load-img").src;
    let inputValue = document.getElementById("modal-elem-title").value;
    let messageInput = document.getElementById("message-elem");

    // checks if title is already taken
    if (isValueTaken(model.elements, "title", inputValue)) {
        messageInput.innerHTML = "This title has already been taken. Choose another one.";
    }
    else {
        // calculate id
        let id = elements.getLatestItemId();
        id++;
        id = "elem" + id;

        // get img src
        let img = imgPreview;

        // get title
        let title = inputValue;

        // get coordinates
        let windowWidth = window.innerWidth;
        let x = windowWidth / 2 - model.elemWidth / 2 + "px";
        let y = "100px";

        // add data to db
        addElementToDb(id, title, img, x, y);

        return [id, title, img, x, y];
    }
}

// creates new element and adds it to the page
function addElementToPage(id, title, img, x, y) {
    // create an object
    let element = new Element(id, title, img, x, y);
    model.elements.push(element);
    // update array of ids
    elements.addIdToArray(id.slice(4));

    // add element
    let elem = document.createElement("div");
    elem.id = id;
    elem.className = "element";
    elem.style.left = x;
    elem.style.top = y;
    document.getElementsByClassName("elements__container")[0].appendChild(elem);
    elem.addEventListener("click", function() {
        element.selectItem(elem.id, "elem");
    });
    elem.addEventListener("mousedown", function(e) {
        dragItem(elem, e, "element");
    });

    // add image container
    let pic = document.createElement("div");
    pic.className = "element__picture";
    pic.id = "pic" + elem.id.toString().slice(4);
    document.getElementById(elem.id).appendChild(pic);

    // add image
    let image = document.createElement("img");
    image.className = "element__img";
    image.src = img;
    image.alt = "image";
    document.getElementById(pic.id).appendChild(image);

    // add icon for displaying selected state
    let icon = document.createElement("img");
    icon.className = "item__icon";
    icon.src = "img/icons8-idea.svg";
    icon.alt = "selected";
    document.getElementById(elem.id).appendChild(icon);

    // add title
    let elem_title = document.createElement("div");
    elem_title.className = "element__title";
    elem_title.innerHTML = title;
    document.getElementById(elem.id).appendChild(elem_title);
}

// gets data from connection modal window
function getConnectionData() {
    let elemTitle1 = document.getElementById("modal-elem1").value;
    let elemTitle2 = document.getElementById("modal-elem2").value;
    let inputValue = document.getElementById("modal-conn-title").value;

    // calculate id
    let id = lines.getLatestItemId();
    id++;
    id = "line" + id;

    // get the ids of the elements connected by the selected line
    let elemId1 = findObjValueByKeyValue(model.elements, "title", elemTitle1, "id");
    let elemId2 = findObjValueByKeyValue(model.elements, "title", elemTitle2, "id");

    // get title
    let title = inputValue;

    // get coordinates
    let [x1, y1] = getElemCenterCoordinates(elemId1);
    let [x2, y2] = getElemCenterCoordinates(elemId2);

    // add data to db
    addLineToDb(id, title, elemId1, elemId2, x1, y1, x2, y2);

    return [id, title, elemId1, elemId2, x1, y1, x2, y2];
}

// creates a new connection between two selected elements and adds it to the page
function addLineToPage(id, title, elemId1, elemId2, x1, y1, x2, y2) {
    // create an object
    let connection = new Connection(id, title, elemId1, elemId2, x1, y1, x2, y2);
    model.lines.push(connection);
    // update array of ids
    lines.addIdToArray(id.toString().slice(4));

    // add line
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.id = id;
    line.setAttribute("class", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    document.getElementsByClassName("lines__container")[0].appendChild(line);
    line.onclick = function () {
        connection.selectItem(line.id, "line");
    }

    // create a text tag for line's title
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.id = "text" + id.slice(4);
    text.setAttribute("class", "line__text");
    text.innerHTML = title;
    // get text coordinates
    let [x, y] = countLineTitleCoordinates(x1, y1, x2, y2, title);
    // set coordinates
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    document.getElementsByClassName("lines-text__container")[0].appendChild(text);
}

function getElemCenterCoordinates(id) {
    let elemPosition = window.getComputedStyle(document.getElementById(id));
    let x = parseFloat(elemPosition.getPropertyValue("left")) + model.elemWidth/2;
    let y = parseFloat(elemPosition.getPropertyValue("top")) + model.elemWidth/2;

    return [x, y];
}

// gets all identifiers of lines which are connected to the selected/draggable element
function getLineIdArr(elemId) {
    let lineArr = [];
    for (let key in model.lines) {
        if ((model.lines[key].elemId1 == elemId) || (model.lines[key].elemId2 == elemId)) {
            lineArr.push(model.lines[key].id);
        } 
    }

    return lineArr;
}

// moves lines connected to the draggable element
function moveLines(elemId) {
    for (let key in model.lines) {
        if (model.lines[key].elemId1 == elemId) {
            // if index is elemId1, the line is connected to the element at the start point, so only x1 and y1 has to be changed
            let [x1, y1] = getElemCenterCoordinates(elemId);
            let lineId = model.lines[key].id;
            let line = document.getElementById(lineId);
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);

            // move line's title
            let x2 = line.getAttribute("x2");
            let y2 = line.getAttribute("y2");
            let textId = "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            const [x, y] = countLineTitleCoordinates(x1, y1, x2, y2, text.innerHTML);
            text.setAttribute("x", x);
            text.setAttribute("y", y);
        }
        else if (model.lines[key].elemId2 == elemId) {
            let [x2, y2] = getElemCenterCoordinates(elemId);
            let lineId = model.lines[key].id;
            let line = document.getElementById(lineId);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);

            // move line's title
            let x1 = line.getAttribute("x1");
            let y1 = line.getAttribute("y1");
            let textId = "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            const [x, y] = countLineTitleCoordinates(x2, y2, x1, y1, text.innerHTML);
            text.setAttribute("x", x);
            text.setAttribute("y", y);
        }
    }
}

// gets all coordinates from the lines connected to the draggable element and writes them to db
function changeLineCoordinates(lineArr) {
    for (let i = 0; i < lineArr.length; i++) {
        let lineId = lineArr[i];
        let line = document.getElementById(lineId);
        let x1 = line.getAttribute("x1");
        let y1 = line.getAttribute("y1");
        let x2 = line.getAttribute("x2");
        let y2 = line.getAttribute("y2");

        // updates coordinates in db
        editItemInDb("lines", lineId, "x1", x1);
        editItemInDb("lines", lineId, "y1", y1);
        editItemInDb("lines", lineId, "x2", x2);
        editItemInDb("lines", lineId, "y2", y2);
    }
}

// gets data from note modal window
function getNoteData() {
    let titleInput = document.getElementById("modal-note-title").value;
    let textInput = document.getElementById("modal-note-text").value;

    // calculate id
    let id = notes.getLatestItemId();
    id++;
    id = "note" + id;

    // get title
    let title = titleInput;

    // get text
    let text = textInput;

    // get coordinates
    let windowWidth = window.innerWidth;
    let x = windowWidth / 2 - model.noteWidth / 2 + "px";
    let y = "100px";

    // add data to db
    addNoteToDb(id, title, text, x, y);

    return [id, title, text, x, y];
}

// creates new note and adds it to the page
function addNoteToPage(id, title, text, x, y) {
    // create an object
    let noteObj = new Note(id, title, text, x, y);
    model.notes.push(noteObj);
    // update array of ids
    notes.addIdToArray(id.toString().slice(4));

    // add note
    let note = document.createElement("div");
    note.id = id;
    note.className = "note";
    note.style.left = x;
    note.style.top = y;
    document.getElementsByClassName("notes__container")[0].appendChild(note);
    note.addEventListener("click", function() {
        noteObj.selectItem(note.id, "note");
    });
    note.addEventListener("mousedown", function(e) {
        dragItem(note, e, "note");
    });

    // add title
    let note_title = document.createElement("p");
    note_title.className = "note__title";
    note_title.innerHTML = title;
    document.getElementById(note.id).appendChild(note_title);

    // add text
    let note_text = document.createElement("textarea");
    note_text.className = "note__text";
    note_text.innerHTML = text;
    document.getElementById(note.id).appendChild(note_text);

    // add icon for displaying selected state
    let icon = document.createElement("img");
    icon.className = "item__icon";
    icon.src = "img/icons8-idea.svg";
    icon.alt = "selected";
    document.getElementById(note.id).appendChild(icon);
}

// finds value by selected item's id
function findObjValue(obj, indexName) {
    for (let key in obj) {
        if (obj[key].id == model.selectedItemId) {
            return((obj[key])[indexName]);
        }
    }
}

// finds searchIndex's value with knownIndex and knownValue
function findObjValueByKeyValue(obj, knownIndex, knownValue, searchIndex) {
    for (let key in obj) {
        if ((obj[key])[knownIndex] == knownValue) {
            return((obj[key])[searchIndex]);
        }
    }
}

// sets new object value
function setObjValue(obj, indexName, value) {
    for (let key in obj) {
        if (obj[key].id == model.selectedItemId) {
            (obj[key])[indexName] = value;
        }
    }
}

// deletes an object
function deleteObj(obj, indexName, value) {
    for (let key in obj) {
        if ((obj[key])[indexName] == value) {
            delete obj[key];
        }
    }
}

// checks if value is taken
function isValueTaken(obj, indexName, value) {
    for (let key in obj) {
        if ((obj[key])[indexName] == value) {
            return true;
        }
    }
}

// prints all properties of an object and their values
function printObj(obj, objName) {
    for (let key in obj) {
        console.log(objName + "." + key + " = " + obj[key]);
    }
}

// add event listeners

let fileInput = document.getElementById("modal-load-file");

fileInput.addEventListener('change', function() {
    elemModal.previewFile();
});

// event listeners for create elements, lines and notes buttons

createElemBtn.addEventListener("click", function() {
    if (elemModal.allInputsAreValid()) {
        // get the data from modal window and put the new item into the db
        let [id, title, img, x, y] = getElementData();
        // create an item
        addElementToPage(id, title, img, x, y);
        
        // clear the inputs and close modal window
        elemModal.clear();
        elemModal.setPreviewImgtoBlank();
        elemModal.close();
    }
});

createConnBtn.addEventListener("click", function() {
    if (connModal.allInputsAreValid()) {
        let [id, title, elemId1, elemId2, x1, y1, x2, y2] = getConnectionData();
        addLineToPage(id, title, elemId1, elemId2, x1, y1, x2, y2);

        // clear the inputs and close modal window
        connModal.clear();
        connModal.clearSelectOptions();
        connModal.close();
    }
});

createNoteBtn.addEventListener("click", function() {
    let [id, title, text, x, y] = getNoteData();
    addNoteToPage(id, title, text, x, y);

    // clear the inputs and close modal window
    noteModal.clear();
    noteModal.close();
});

// event listeners for update elements, lines and notes buttons

updateElemBtn.addEventListener("click", function() {
    if (elemModal.allInputsAreValid()) {
        updateElem();
        elemModal.clear();
        elemModal.setPreviewImgtoBlank();
        elemModal.close();
    }
});

updateConnBtn.addEventListener("click", function() {
    if (connModal.allInputsAreValid()) {
        updateConn();
        connModal.clear();
        connModal.clearSelectOptions();
        connModal.close();
    }
});

updateNoteBtn.addEventListener("click", function() {
    updateNote();
    noteModal.clear();
    noteModal.close();
});

function updateElem() {
    let previewImg = document.getElementById("modal-load-img").src;
    let titleInput = document.getElementById("modal-elem-title").value;

    // update data in db
    editItemInDb("elements", model.selectedItemId, "img", previewImg);
    editItemInDb("elements", model.selectedItemId, "title", titleInput);

    // update data in object
    setObjValue(model.elements, "img", previewImg);
    setObjValue(model.elements, "title", titleInput);

    // update data on screen
    let item = document.getElementById(model.selectedItemId);
    let img = item.querySelector(".element__img");
    img.src = previewImg;
    let title = item.querySelector(".element__title");
    title.innerHTML = titleInput;
}

function updateConn() {
    let elemTitle1 = document.getElementById("modal-elem1").value;
    let elemTitle2 = document.getElementById("modal-elem2").value;
    let titleInput = document.getElementById("modal-conn-title").value;

    let elemId1 = findObjValueByKeyValue(model.elements, "title", elemTitle1, "id");
    let elemId2 = findObjValueByKeyValue(model.elements, "title", elemTitle2, "id");

    let [x1, y1] = getElemCenterCoordinates(elemId1);
    let [x2, y2] = getElemCenterCoordinates(elemId2);

    // update data in db
    editItemInDb("lines", model.selectedItemId, "elemId1", elemId1);
    editItemInDb("lines", model.selectedItemId, "elemId2", elemId2);
    editItemInDb("lines", model.selectedItemId, "title", titleInput);
    editItemInDb("lines", model.selectedItemId, "x1", x1);
    editItemInDb("lines", model.selectedItemId, "y1", y1);
    editItemInDb("lines", model.selectedItemId, "x2", x2);
    editItemInDb("lines", model.selectedItemId, "y2", y2);

    // update data in object
    setObjValue(model.lines, "elemId1", elemId1);
    setObjValue(model.lines, "elemId2", elemId2);
    setObjValue(model.lines, "title", titleInput);
    setObjValue(model.lines, "x1", x1);
    setObjValue(model.lines, "y1", y1);
    setObjValue(model.lines, "x2", x2);
    setObjValue(model.lines, "y2", y2);

    // update data on screen
    let item = document.getElementById(model.selectedItemId);
    item.setAttribute("x1", x1);
    item.setAttribute("y1", y1);
    item.setAttribute("x2", x2);
    item.setAttribute("y2", y2);
    // update text tag
    let textId = "text" + model.selectedItemId.slice(4);
    let text = document.getElementById(textId);
    text.innerHTML = titleInput;
    let [x, y] = countLineTitleCoordinates(x1, y1, x2, y2, titleInput);
    text.setAttribute("x", x);
    text.setAttribute("y", y);
}

function updateNote() {
    let titleInput = document.getElementById("modal-note-title").value;
    let textInput = document.getElementById("modal-note-text").value;

    // update data in db
    editItemInDb("notes", model.selectedItemId, "title", titleInput);
    editItemInDb("notes", model.selectedItemId, "text", textInput);

    // update data in object
    setObjValue(model.notes, "title", titleInput);
    setObjValue(model.notes, "text", textInput);

    // update data on screen
    let item = document.getElementById(model.selectedItemId);
    let title = item.querySelector(".note__title");
    title.innerHTML = titleInput;
    let text = item.querySelector(".note__text");
    text.innerHTML = textInput;
}

function deleteElement(id) {

    // find lines connected to this element and delete them
    let lineArr = getLineIdArr(id);
    for (let i = 0; i < lineArr.length; i++) {
        deleteConnection(lineArr[i]);
    }

    // delete id from array of all elements
    elements.removeIdFromArray(id.slice(4));

    // delete an object
    deleteObj(model.elements, "id", id);

    // delete data from db
    deleteItemFromDb("elements", id);

    // delete the element
    let elem = document.getElementById(id);
    elem.parentNode.removeChild(elem);
}

function deleteConnection(id) {

    // delete id from array of all lines
    lines.removeIdFromArray(id.slice(4));

    // delete an object
    deleteObj(model.lines, "id", id);

    // delete data from db
    deleteItemFromDb("lines", id);

    let line = document.getElementById(id);
    line.parentNode.removeChild(line);

    // delete line title
    deleteLineTitle(id);
}

function deleteLineTitle(id) {

    let titleId = "text" + id.slice(4); 

    let title = document.getElementById(titleId);
    title.parentNode.removeChild(title);
}

function countLineTitleCoordinates(x1, y1, x2, y2, title) {

    // calculate the width of the text above the line
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = "14px Montserrat, sans-serif";

    let text = ctx.measureText(title); // TextMetrics object
    // console.log("text.width = " + text.width);

    // result
    x1 = parseFloat(x1);
    y1 = parseFloat(y1);
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);

    let x = x1 + (x2 - x1) / 2 - text.width / 2;
    let y = y1 + (y2 - y1) / 2;
    
    // console.log("x = " + x + ", y = " + y);

    return [x, y];
}

function deleteNote(id) {

    // delete id from array of all notes
    notes.removeIdFromArray(id.slice(4));

    // delete an object
    deleteObj(model.notes, "id", id);

    // delete data from db
    deleteItemFromDb("notes", id);

    // delete the note
    let note = document.getElementById(id);
    note.parentNode.removeChild(note);
}

let clearDbButton = document.getElementById("clear-db");

clearDbButton.addEventListener("click", function() {
    if (window.confirm("Are you sure you want to clear the data? After deletion, the page will be reloaded.")) {
        // delete items from db
        clearObjStore("elements");
        clearObjStore("lines");
        clearObjStore("notes");
        // reload the page
        document.location.reload();
    }
});

export { model, view };
export { findObjValue, findObjValueByKeyValue };
export { createArrayOfTitles };
export { addElementToPage, addLineToPage, addNoteToPage };