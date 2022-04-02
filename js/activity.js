'use strict';

function init() {
    // drag'n'drop elements
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i, "element");
    }
    
    for (let i = 0; i < draggableNotes.length; i++) {
        dragElement(draggableNotes[i], i, "note");
    }

    elemModal.setPreviewImgtoBlank();
}

window.onload = init;

let model = {
    elemNumber: 0,
    connNumber: 0,
    noteNumber: 0,
    elemWidth: 200,
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

// modal constructor

function Modal(window, createBtn, updateBtn) {
    this.window = document.getElementById(window);
    this.createBtn = document.getElementById(createBtn);
    this.updateBtn = document.getElementById(updateBtn);
}

// opens modal window
Modal.prototype.open = function() {
    this.window.classList.add("modal__open");
}

// closes modal window
Modal.prototype.close = function() {
    this.window.classList.remove("modal__open");
}

// show create btn, hide update btn
Modal.prototype.showCreateBtn = function() {
    this.createBtn.classList.remove("hidden");
    this.updateBtn.classList.add("hidden");
}

// show update btn, hide create btn
Modal.prototype.showUpdateBtn = function() {
    this.updateBtn.classList.remove("hidden");
    this.createBtn.classList.add("hidden");
}

// clear all text fields and error messages
Modal.prototype.clear = function() {
    this.window.querySelector(".modal__input").value = "";
    if (this.window.querySelector(".modal__message") != null) {
        this.window.querySelector(".modal__message").innerHTML = "";
    }
}

// checks if text input is valid
Modal.prototype.inputIsValid = function() {
    let regex = /^[^\s]+[A-Za-z\d\s]+[^\s]$/;
    let inputValue = this.window.querySelector(".modal__input").value;

    console.log("in check " + inputValue);    

    if (regex.test(inputValue)) {
        return true;
    }
}

// element modal window

let elemModal = new Modal("modal-element", "create-elem-btn", "update-elem-btn");

// shows that image isn't selected yet
elemModal.setPreviewImgtoBlank = function() {
    let previewImg = document.getElementById("modal-load-img");

    previewImg.src = "img/add-image.png";
    previewImg.classList.add("blank");
}

// removes default icon when image is selected
elemModal.removeBlankClass = function() {
    let previewImg = document.getElementById("modal-load-img");

    previewImg.classList.remove("blank");
}

// adds a file preview and representes the file's data as a base64 encoded string
elemModal.previewFile = function() {
    let previewImg = document.getElementById("modal-load-img");
    let file = document.getElementById("modal-load-file").files[0];
    let reader = new FileReader();
  
    reader.onloadend = function () {
        previewImg.src = reader.result;
    }
  
    if (file) {
        reader.readAsDataURL(file);
        elemModal.removeBlankClass();
    }
    else {
        elemModal.setPreviewImgtoBlank();
    }
}

// fills inputs with data from db
elemModal.fillInputs = function() {
    let previewImg = document.getElementById("modal-load-img");
    let titleInput = document.getElementById("modal-elem-title");

    let img = findObjValue(model.elements, "img");
    let title = findObjValue(model.elements, "title");

    previewImg.src = img;
    titleInput.value = title;
}

// checks if image is selected
elemModal.imageIsSelected = function() {
    let imgPreview = document.getElementById("modal-load-img");

    if (imgPreview.classList.contains("blank")) {
        console.log("no files selected");
    }
    else {
        console.log("image is selected");
        return true;
    }
}

// checks if inputs are valid
elemModal.allInputsAreValid = function() {
    if (elemModal.imageIsSelected() && elemModal.inputIsValid()) {
        return true;
    }
    else {
        elemModal.showErrorMessages();
    }
}

// shows error message that explains which input is empty or incorrect
elemModal.showErrorMessages = function() {
    let message = document.getElementById("message-elem");

    if (elemModal.imageIsSelected()) {
        if (!elemModal.inputIsValid()) {
            message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
        }
    }
    else {
        if (elemModal.inputIsValid()) {
            message.innerHTML = "No image was selected";
        }
        else {
            message.innerHTML = "All fields must contain data";
        }
    }
}

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

let connModal = new Modal("modal-connection", "create-conn-btn", "update-conn-btn");

let selectFirstElement = document.getElementById("modal-elem1");
let selectSecondElement = document.getElementById("modal-elem2");

// fills both dropdown lists with options
connModal.fillSelectOptions = function() {
    let elements = document.getElementsByClassName("element__title");

    for (let i = 0; i < elements.length; i++) {
        let option = elements[i].innerHTML;

        let elem = document.createElement("option");
        elem.textContent = option;
        elem.value = option;
        selectFirstElement.appendChild(elem);

        let elem2 = elem.cloneNode(true);
        selectSecondElement.appendChild(elem2);
    }
}

// clears options in dropdown lists
connModal.clearSelectOptions = function() {
    let num = selectFirstElement.options.length - 1;
    for (let i = num; i > 0; i--) {
        selectFirstElement.remove(i);
        selectSecondElement.remove(i);
    }
}

// sets disabled state to options which cannot be selected
connModal.disableUnavalilableSelectOptions = function(currentSelectId, anotherSelectId) {
    let elems = document.querySelector("#modal-elem1").getElementsByTagName("option");
    let select1 = document.getElementById(currentSelectId);
    let select2 = document.getElementById(anotherSelectId);
    let elemTitle = select1.value;

    let elemId = findObjValueByKeyValue(model.elements, "title", elemTitle, "id");
    let titleArr = createArrayOfTitles(elemId);

    for (let i = 1; i < elems.length; i++) {
        // remove disabled state on every element until we find the new chosen one
        select2[i].disabled = false;
        // disable the same element in another dropdown list
        if (select1.selectedIndex == i) {
            select2[i].disabled = true;
        }
        // disable all elements which already have connection with the selected element
        for (let j = 0; j < titleArr.length; j++) {
            if (select2.options[i].text == titleArr[j]) {
                select2[i].disabled = true;
            }
        }
    }
}

// fills inputs with data from db
connModal.fillInputs = function() {
    let titleInput = document.getElementById("modal-conn-title");

    let elemId1 = findObjValue(model.lines, "elemId1");
    let elemId2 = findObjValue(model.lines, "elemId2");
    let title = findObjValue(model.lines, "title");

    let elemTitle1 = findObjValueByKeyValue(model.elements, "id", elemId1, "title");
    let elemTitle2 = findObjValueByKeyValue(model.elements, "id", elemId2, "title");

    selectFirstElement.value = elemTitle1;
    selectSecondElement.value = elemTitle2;
    titleInput.value = title;
}

// checks if dropdown options are selected
connModal.dropdownOptionsAreSelected = function() {
    let index1 = selectFirstElement.selectedIndex;
    let index2 = selectSecondElement.selectedIndex;

    if ((index1 != 0) && (index2 != 0)) {
        // both options are selected
        return true;
    }
}

// checks if inputs are valid
connModal.allInputsAreValid = function() {
    if (connModal.dropdownOptionsAreSelected() && connModal.inputIsValid()) {
        return true;
    }
    else {
        connModal.showErrorMessages();
    }
}

// shows error message that explains which input is empty or incorrect
connModal.showErrorMessages = function() {
    let message = document.getElementById("message-conn");

    if (connModal.dropdownOptionsAreSelected()) {
        if (!connModal.inputIsValid()) {
            message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
        }
    }
    else {
        if (connModal.inputIsValid()) {
            message.innerHTML = "One of elements isn't selected";
        }
        else {
            message.innerHTML = "All fields must contain data";
        }
    }
}

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

let noteModal = new Modal("modal-note", "create-note-btn", "update-note-btn");

// fills inputs with data from db
noteModal.fillInputs = function() {
    let titleInput = document.getElementById("modal-note-title");
    let textInput = document.getElementById("modal-note-text");

    let title = findObjValue(model.notes, "title");
    let text = findObjValue(model.notes, "text");

    titleInput.value = title;
    textInput.value = text;
}

// checks if inputs are empty
noteModal.inputsAreEmpty = function() {
    let titleInput = document.getElementById("modal-note-title").value;
    let textInput = document.getElementById("modal-note-text").value;

    if ((titleInput == "") && (textInput == "")) {
        return true;
    }
}

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

// item constructor

function Item() {
    // selected: false;
}

// select item onclick
Item.prototype.selectItem = function(itemId, itemType) {
    // the element selected now
    let item = document.getElementById(itemId);
    let className = "";

    if ((itemType == "elem") || (itemType == "note")) {
        className = "item__selected";
        view.showIcon(itemId);
    }
    else if (itemType == "line") {
        className = "line__selected";
    }

    view.removeSelection(itemId);
    item.classList.add(className);

    model.selectedItemId = itemId; // remember id of the latest selected element
    model.selectedType = itemType; // remember if the latest selected item was element, line or note

    view.setEditDeleteBtnState();
}

Item.prototype.removeSelection = function() {
    // ...
}

// draggableItem constructor

function draggableItem() {
    // ...
}

draggableItem.prototype = new Item();

draggableItem.prototype.dragItem = function() {
    // ...
}

// element constructor

function Element(id, title, img, x, y) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.x = x;
    this.y = y;
}

Element.prototype = new draggableItem();

// Element.prototype.selected = false;

// connection constructor

function Connection(id, title, elemId1, elemId2, x1, y1, x2, y2) {
    this.id = id;
    this. title = title;
    this.elemId1 = elemId1;
    this.elemId2 = elemId2;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

Connection.prototype = new Item();

// note constructor

function Note(id, title, text, x, y) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.x = x;
    this.y = y;
}

Note.prototype = new draggableItem();

let draggableElements = document.getElementsByClassName("element");

let draggableNotes = document.getElementsByClassName("note");

function dragElement(elem, i, itemType) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (document.getElementById(elem.id)) {
        document.getElementById(elem.id).onmousedown = dragMouseDown;
    }
    else {
        elem.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";

        // получим id линий, которые присоединены к этому элементу

        if (itemType == "element") {
            findLineId(draggableElements[i].id, elem, 'move');
        }
    }

    function closeDragElement() {

        if (itemType == "element") {

            // определим id элемента, который мы передвигаем
            console.log(draggableElements[i].id);

            // edit element's coordinates in db
            editItemInDb("elements", draggableElements[i].id, "x", elem.style.left);
            editItemInDb("elements", draggableElements[i].id, "y", elem.style.top);

            // lineArr stores identifiers of the lines connected to the draggable element 
            let lineArr = findLineId(draggableElements[i].id, elem, 'find');

            // updates new coordinates to db after moving an element
            changeLineCoordinates(lineArr);
        }
        else if (itemType == "note") {
            console.log(draggableNotes[i].id);

            // edit element's coordinates in db
            editItemInDb("notes", draggableNotes[i].id, "x", elem.style.left);
            editItemInDb("notes", draggableNotes[i].id, "y", elem.style.top);
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// variables

let newItem = document.getElementById("new-element");

let modalWindow = document.getElementById("modal-element");
let modalWindowConnection = document.getElementById("modal-connection");
let modalWindowNote = document.getElementById("modal-note");

let closeBtn = document.querySelector("modal__close");

// toolbar

// zoom

setZoomValue();

function zoom(name) {

    let scale = Number(getZoomValue());
    
    // 1.0 is default value
    if (name == 'in') {
        // if zoom is not max yet
        if (scale < 1) {
            scale = (scale + 0.1).toFixed(1);
        }
    }
    else if (name == 'out') {
        if (scale > 0.6) {
            scale = (scale - 0.1).toFixed(1);
        }
    }

    container.style.transform = "scale(" + scale + ")";

    localStorage.setItem("zoom", scale);
}

function setZoomValue() {

    let scale = getZoomValue();

    container.style.transform = "scale(" + scale + ")";
}

function getZoomValue() {

    let scale = "";

    if (isNaN(localStorage.getItem("zoom")) || (localStorage.getItem("zoom") == null)) {
        scale = localStorage.setItem("zoom", 1);
    }
    else {
        scale = localStorage.getItem("zoom");
    }

    return scale;
}

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
        let id = model.selectedItemId.slice(4);
        let key = findObjKey(model.lines, "line" + id);
        deleteLineObject(model.lines[key], "line" + id);
        deleteConnection("line" + id);
        deleteLineTitle("line" + id);
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

    for (let i = 0; i <= lines.maxNumId; i++) {
        for (let key in model.lines[i]) {
            if (((model.lines[i])[key] == elemId) && (key == "elemId1")) {
                idArr.push((model.lines[i])["elemId2"]);
            }
            else if (((model.lines[i])[key] == elemId) && (key == "elemId2")) {
                idArr.push((model.lines[i])["elemId1"]);
            }
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
    elem.onclick = function() {
        element.selectItem(elem.id, "elem");
    }

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

    // calling drag function again after creating a new div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i, "element");
    }
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
    let [x, y] = defineLineTitleCoordinates(x1, y1, x2, y2, title);
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

// finds all identifiers of lines which are connected to the draggable element

function findLineId(draggableElementId, elem, action) {

    let lineId = "";
    let lineArr = [];

    for (let i = 0; i <= lines.maxNumId; i++) {
        //showDivs(lines["line" + i], "lines.line" + i);

        for (let key in model.lines[i]) {
            // console.log("lines.line" + i + "." + key + " = " + (lines["line" + i])[key]);

            if ((model.lines[i])[key] == draggableElementId) {
                // console.log("key = " + i);
                // console.log("innerKey = " + key);
                // console.log("lineId = " + model.lines[i].id);
                lineId = model.lines[i].id;
                if (action == 'find') {
                    lineArr.push(lineId);
                }
                else if (action == 'move') {
                    moveLines(lineId, elem, key);
                }
                else if (action == 'delete') {
                    deleteLineObject(model.lines[i], lineId);
                    deleteConnection(lineId);
                    deleteLineTitle(lineId);
                    // if the line is connected to the deleted element at the start point (divId1), we don't need to read the key (elemId2) that defines the element to which the line is connected at the end point (divId2)
                    break;
                }
            }   
        }
    }
    return lineArr;
}

// moves lines connected to the draggable element

function moveLines(lineId, elem, key) {
    let linesAll = document.getElementsByTagName("line");

    for (let i = 0; i < linesAll.length; i++) {
        if ((linesAll[i].id == lineId) && (key == "elemId1")) {
            let x1 = parseFloat(elem.style.left) + model.elemWidth/2;
            let y1 = parseFloat(elem.style.top) + model.elemWidth/2;

            linesAll[i].setAttribute("x1", x1);
            linesAll[i].setAttribute("y1", y1);

            // move line's title

            let x2 = linesAll[i].getAttribute("x2");
            let y2 = linesAll[i].getAttribute("y2");

            let textId = "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            // console.log("text = " + textId);

            const [x, y] = defineLineTitleCoordinates(x1, y1, x2, y2, text.innerHTML);

            text.setAttribute("x", x);
            text.setAttribute("y", y);
        }
        else if ((linesAll[i].id == lineId) && (key == "elemId2")) {
            let x2 = parseFloat(elem.style.left) + model.elemWidth/2;
            let y2 = parseFloat(elem.style.top) + model.elemWidth/2;
            linesAll[i].setAttribute("x2", x2);
            linesAll[i].setAttribute("y2", y2);

            // move line's title

            let x1 = linesAll[i].getAttribute("x1");
            let y1 = linesAll[i].getAttribute("y1");

            let textId= "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            // console.log("text = " + textId);

            const [x, y] = defineLineTitleCoordinates(x2, y2, x1, y1, text.innerHTML);

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
    note.onclick = function() {
        noteObj.selectItem(note.id, "note");
    }

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

    // calling drag function again after creating a new div
    for (let i = 0; i < draggableNotes.length; i++) {
        dragElement(draggableNotes[i], i, "note");
    }
}

// finds value by selected item's id
function findObjValue(obj, keyName) {
    for (let key in obj) {
        if (obj[key].id == model.selectedItemId) {
            return((obj[key])[keyName]);
        }
    }
}

// finds searchKey's value with knownKey and knownValue
function findObjValueByKeyValue(obj, knownKey, knownValue, searchKey) {
    for (let key in obj) {
        if ((obj[key])[knownKey] == knownValue) {
            return((obj[key])[searchKey]);
        }
    }
}

// checks if value is taken
function isValueTaken(obj, knownKey, knownValue) {
    for (let key in obj) {
        if ((obj[key])[knownKey] == knownValue) {
            console.log((obj[key])[knownKey] + " ?= " + knownValue);
            return true;
        }
    }
}

// finds key by keyValue
function findObjKey(obj, keyValue) {
    for (let i = 0; i <= lines.maxNumId; i++) {
        for (let key in obj[i]) {
            if ((obj[i])[key] == keyValue) {
                return(i);
            }
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

    editItemInDb("elements", model.selectedItemId, "img", previewImg);
    editItemInDb("elements", model.selectedItemId, "title", titleInput);
}

function updateConn() {
    let elemTitle1 = document.getElementById("modal-elem1").value;
    let elemTitle2 = document.getElementById("modal-elem2").value;
    let title = document.getElementById("modal-conn-title").value;

    let divId1 = findObjValueByKeyValue(model.elements, "title", elemTitle1, "id");
    let divId2 = findObjValueByKeyValue(model.elements, "title", elemTitle2, "id");

    let [x1, y1] = getElemCenterCoordinates(divId1);
    let [x2, y2] = getElemCenterCoordinates(divId2);

    editItemInDb("lines", model.selectedItemId, "elem1", divId1);
    editItemInDb("lines", model.selectedItemId, "elem2", divId2);
    editItemInDb("lines", model.selectedItemId, "title", title);
    editItemInDb("lines", model.selectedItemId, "x1", x1);
    editItemInDb("lines", model.selectedItemId, "y1", y1);
    editItemInDb("lines", model.selectedItemId, "x2", x2);
    editItemInDb("lines", model.selectedItemId, "y2", y2);
}

function updateNote() {
    let titleInput = document.getElementById("modal-note-title").value;
    let textInput = document.getElementById("modal-note-text").value;

    editItemInDb("notes", model.selectedItemId, "title", titleInput);
    editItemInDb("notes", model.selectedItemId, "text", textInput);
}

function deleteElement(divId) {

    // find lines connected to this element and delete them
    findLineId(divId, "", 'delete');

    // delete id from array of all elements
    elements.removeIdFromArray(divId.slice(3));

    // delete data from db
    deleteItem("elements", divId);

    // delete the element
    let elem = document.getElementById(divId);
    elem.parentNode.removeChild(elem);

    // calling drag function again after deleting a div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i, "element");
    }
}

function deleteLineObject(obj, lineId) {
    for (let key in obj) {
        if ((key == "id") && (obj[key] == lineId)) {
            console.log("id = " + key + " lineId = " + lineId);
            delete model.lines[key];
        }
    }
}

function deleteConnection(lineId) {

    // delete id from array of all lines
    lines.removeIdFromArray(lineId.slice(4));

    // delete data from db
    deleteItem("lines", lineId);

    let line = document.getElementById(lineId);
    line.parentNode.removeChild(line);
}

function defineLineTitleCoordinates(x1, y1, x2, y2, title) {

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

function deleteLineTitle(lineId) {

    let titleId = "text" + lineId.slice(4); 
    console.log("deleteLineTitleFunction");
    console.log("titleId = " + titleId);

    let title = document.getElementById(titleId);
    title.parentNode.removeChild(title);
}

function deleteNote(noteId) {

    // delete id from array of all notes
    notes.removeIdFromArray(noteId.slice(4));

    // delete data from db
    deleteItem("notes", noteId);

    // delete the note
    let note = document.getElementById(noteId);
    note.parentNode.removeChild(note);

    // calling drag function again after deleting a div
    for (let i = 0; i < draggableNotes.length; i++) {
        dragElement(draggableNotes[i], i, "note");
    }
}

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
    readItems("elements");
    readItems("lines");
    readItems("notes");
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
        elem1: elemId1,
        elem2: elemId2,
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

// find an item in the db
function findItem(objectStoreName, key) {
    var transaction = db.transaction([objectStoreName], "readonly");
    var elements = transaction.objectStore(objectStoreName);
    let request = elements.get(key);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {

        const matching = request.result;

        if (matching !== undefined) {
            // a match was found
            // console.log("a match was found");
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
function deleteItem(objectStoreName, key) {
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
function readItems(objectStoreName) {
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
                addLineToPage(cursor.key, cursor.value.title, cursor.value.elem1, cursor.value.elem2, cursor.value.x1, cursor.value.y1, cursor.value.x2, cursor.value.y2);
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

let clearDbButton = document.getElementById("clear-db");

clearDbButton.addEventListener("click", function() {
    if (window.confirm("Are you sure you want to clear the data? After deletion, the page will be reloaded.")) {
        // delete items from db
        deleteItems("elements");
        deleteItems("lines");
        deleteItems("notes");
        // reload the page
        document.location.reload();
    }
});

// delete all data from the db
function deleteItems(objectStoreName) {
    let request = db.transaction([objectStoreName], "readwrite").objectStore(objectStoreName).clear();

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("all items were deleted successfully from db");
    }
}