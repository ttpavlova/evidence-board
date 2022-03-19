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
};

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

Modal.prototype.showUpdateBtn = function() {
    this.updateBtn.classList.remove("hidden");
    this.createBtn.classList.add("hidden");
}

// clear all text fields and error messages
Modal.prototype.clear = function() {
    this.window.querySelector(".modal__input").value = "";
    if (this.window.querySelector(".modal__message") != null) {
        this.window.querySelector(".modal__message").value = "";
    }
}

// element modal window

let elemModal = new Modal("modal-element", "create-elem-btn", "update-elem-btn");

elemModal.setPreviewImgtoBlank = function() {
    let previewImg = document.getElementById("modal-load-img");

    previewImg.src = "img/add-image.png";
    previewImg.classList.add("blank");
}

elemModal.removeBlankClass = function() {
    let previewImg = document.getElementById("modal-load-img");

    previewImg.classList.remove("blank");
}

let newElemBtn = document.getElementById("new-element");

newElemBtn.addEventListener("click", function() {
    elemModal.open();
    elemModal.showCreateBtn();
});

let closeElemModalBtn = document.getElementById("close-btn");

closeElemModalBtn.addEventListener("click", function() {
    elemModal.close();
    elemModal.clear();
    elemModal.setPreviewImgtoBlank();
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

let newConnBtn = document.getElementById("new-connection");

newConnBtn.addEventListener("click", function() {
    connModal.open();
    connModal.fillSelectOptions();
    connModal.showCreateBtn();
});

let closeConnModalBtn = document.getElementById("close-btn-connection");

closeConnModalBtn.addEventListener("click", function() {
    connModal.close();
    connModal.clear();
    connModal.clearSelectOptions();
});

// note modal window

let noteModal = new Modal("modal-note", "create-note-btn", "update-note-btn");

let newNoteBtn = document.getElementById("new-note");

newNoteBtn.addEventListener("click", function() {
    noteModal.open();
    noteModal.showCreateBtn();
});

let closeNoteModalBtn = document.getElementById("close-btn-note");

closeNoteModalBtn.addEventListener("click", function() {
    noteModal.close();
    noteModal.clear();
});

// element constuctor

function Element(id, img, title, x, y) {
    this.id = id;
    this.img = img;
    this.title = title;
    this.x = x;
    this.y = y;
}

Element.prototype.selected = false;

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

            // function to select the element
            selectItem(draggableElements[i].id, "elem");

            // edit element's coordinates in db
            editItem("elements", draggableElements[i].id, "x", elem.style.left);
            editItem("elements", draggableElements[i].id, "y", elem.style.top);

            console.log("lineNumber = " + lineNumber);

            // lineArr stores identifiers of the lines connected to the draggable element 
            let lineArr = findLineId(draggableElements[i].id, elem, 'find');

            // updates new coordinates to db after moving an element
            changeLineCoordinates(lineArr);
        }
        else if (itemType == "note") {
            console.log(draggableNotes[i].id);

            // function to select the element
            selectItem(draggableNotes[i].id, "note");

            // edit element's coordinates in db
            editItem("notes", draggableNotes[i].id, "x", elem.style.left);
            editItem("notes", draggableNotes[i].id, "y", elem.style.top);
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// variables

let elementWidth = 150;

let newItem = document.getElementById("new-element");

let modalWindow = document.getElementById("modal-element");
let modalWindowConnection = document.getElementById("modal-connection");
let modalWindowNote = document.getElementById("modal-note");

let closeBtn = document.querySelector("modal__close");

let messageInput = document.getElementById("message-input");
let messageInputConnection = document.getElementById("message-input-connection");

let divNumber = 0;
let lineNumber = 0;
let noteNumber = 0;

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
        elemModal.showUpdateBtn();
    }
    else if (model.selectedType == "line") {
        connModal.open();
        connModal.fillSelectOptions();
        connModal.showUpdateBtn();
    }
    else if (model.selectedType == "note") {
        noteModal.open();
        noteModal.showUpdateBtn();
    }
});

deleteBtn.addEventListener("click", function() {
    // delete item
    if (selectedType == "elem") {
        deleteElement(selectedItemId);
    }
    else if (selectedType == "line") {
        let id = selectedItemId.slice(4);
        deleteLineObject(lines["line" + id], "line" + id);
        deleteConnection("line" + id);
        deleteLineTitle("text" + id);
    }
    else if (selectedType == "note") {
        deleteNote(selectedItemId);
    }

    selectedItemId = "";
    selectedType = "";
});

// add/remove disabled state to icons on toolbar

function ifSelectedItemExists() {
    if (model.selectedItemId == "") {
        editBtn.classList.add("iconDisabled");
        deleteBtn.classList.add("iconDisabled");
    }
    else {
        editBtn.classList.remove("iconDisabled");
        deleteBtn.classList.remove("iconDisabled");
    } 
}

// set edit and delete buttons to disabled by default
ifSelectedItemExists();

// select item onclick/onmove

function selectItem(itemId, itemType) {

    // the element selected now
    let item = document.getElementById(itemId);
    let ideaIcon = item.querySelector(".item__icon");
    // latest selected element
    let itemSelected = document.getElementById(model.selectedItemId);
    
    let className = "";

    if ((itemType == "elem") || (itemType == "note")) {
        className = "item__selected";
    }
    else if (itemType == "line") {
        className = "line__selected";
    }

    // if the item clicked just now is not selected already, we need to remove previous item's selection
    if (model.selectedItemId != "") {
        let ideaIconSelected = itemSelected.querySelector(".item__icon");
        if (model.selectedType != itemType) {
            // if previously selected item has deifferent type
            if (itemType == "elem") {
                if (model.selectedType == "line") {
                    itemSelected.classList.remove("line__selected");
                }
                else if (model.selectedType == "note") {
                    itemSelected.classList.remove("item__selected");
                    ideaIconSelected.classList.remove("icon__visible");
                }
            }
            else if (itemType == "line") {
                if (model.selectedType == "elem") {
                    itemSelected.classList.remove("item__selected");
                }
                else if (model.selectedType == "note") {
                    itemSelected.classList.remove("item__selected");
                }
                ideaIconSelected.classList.remove("icon__visible");
            }
            else if (itemType == "note") {
                if (model.selectedType == "elem") {
                    itemSelected.classList.remove("item__selected");
                    ideaIconSelected.classList.remove("icon__visible");
                }
                else if (model.selectedType == "line") {
                    itemSelected.classList.remove("line__selected");
                }
            }
        }
        else {
            itemSelected.classList.remove(className);
            ideaIconSelected.classList.remove("icon__visible");
        }
    }

    if ((itemType == "elem") || (itemType == "note")) {
        item.classList.add(className);
        ideaIcon.classList.add("icon__visible");
    }
    else if (itemType == "line") {
        item.classList.add(className);
    }

    model.selectedItemId = itemId; // remember id of the latest selected element
    model.selectedType = itemType; // remember if the latest selected item was element or line

    ifSelectedItemExists();
}

// area that doesn't include svg lines
let background = document.getElementById("background");

background.addEventListener("click", function() {
    if (model.selectedItemId != "") {
        removeSelection();
    }

    ifSelectedItemExists();
});

function removeSelection() {
    // latest selected item
    let itemSelected = document.getElementById(model.selectedItemId);
    let ideaIcon = itemSelected.querySelector(".item__icon");

    if ((model.selectedType == "elem") || (model.selectedType == "note")) {
        itemSelected.classList.remove("item__selected");
        ideaIcon.classList.remove("icon__visible");
    }
    else if (model.selectedType == "line") {
        itemSelected.classList.remove("line__selected");
    }

    model.selectedItemId = "";
    model.selectedType = "";
}

// eventlistener to disable option if it's already selected in another dropdown

selectFirstElement.addEventListener("change", function() {
    disableUnavalilableSelectOptions("first");
});

selectSecondElement.addEventListener("change", function() {
    disableUnavalilableSelectOptions("second");
});

function disableUnavalilableSelectOptions(select) {

    let elems = document.querySelector('#modal-elem1').getElementsByTagName('option');

    let firstElement = document.getElementById("modal-elem1");
    let secondElement = document.getElementById("modal-elem2");
    let elemTitle = "";

    if (select == "first") {
        selectFirstElement = document.getElementById("modal-elem1");
        selectSecondElement = document.getElementById("modal-elem2");
        elemTitle = firstElement.value;
    }
    else if (select == "second") {
        selectSecondElement = document.getElementById("modal-elem1");
        selectFirstElement = document.getElementById("modal-elem2");
        elemTitle = secondElement.value;
    }

    let elemId = findElemObjValue(elemTitle, "id");
    let titleArr = createArrayOfTitles(elemId);
    
    for (let i = 1; i < elems.length; i++) {
        // remove disabled state on every element until we find the new chosen one
        selectSecondElement[i].disabled = false;
        if (selectFirstElement.selectedIndex == i) {
            selectSecondElement[i].disabled = true;
        }

        for (let j = 0; j < titleArr.length; j++) {
            if (selectSecondElement.options[i].text == titleArr[j]) {
                selectSecondElement[i].disabled = true;
            }
        }
    }
}

// generates an array of elements' identifiers
// includes all elements connected to the element selected in the dropdown list

function createArrayOfIds(elemId) {

    let idArr = [];

    for (let i = 0; i <= lineNumber; i++) {
        for (let key in lines["line" + i]) {
            if (((lines["line" + i])[key] == elemId) && (key == "elemId1")) {
                idArr.push((lines["line" + i])["elemId2"]);
            }
            else if (((lines["line" + i])[key] == elemId) && (key == "elemId2")) {
                idArr.push((lines["line" + i])["elemId1"]);
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
        let title = findElemObjValue(idArr[i], "title");
        titleArr.push(title);
    }

    return titleArr;
}

// creates a line between two selected elements

function createConnection(lineId, lineTitle, elemId1, elemId2, line_x1, line_y1, line_x2, line_y2, createFrom) {

    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    let linesNum = 0;
    let x1, y1, x2, y2 = 0;
    let inputValueConnection = "";
    let divId1 = "";
    let divId2 = "";

    // create text tag for line's title
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let title = "";

    if (createFrom == "db") {
        inputValueConnection = lineTitle;
        divId1 = elemId1;
        divId2 = elemId2;
        x1 = line_x1;
        y1 = line_y1;
        x2 = line_x2;
        y2 = line_y2;

        // update array of lines' id
        findLatestLineID(lineId.slice(4), "db");

        line.id = lineId;

        text.id = "text" + lineId.slice(4);
        // text title
        title = lineTitle;
    }
    else {
        inputValueConnection = document.getElementById("modal-connection-title").value;

        divId1 = getElemIdFromTitle("first");
        divId2 = getElemIdFromTitle("second");

        // get (x;y) of div1 and div2

        [x1, y1] = getElemCenterCoordinates(divId1);
        [x2, y2] = getElemCenterCoordinates(divId2);

        linesNum = findLatestLineID();

        line.id = "line" + linesNum;

        // create text tag for line's title
        title = document.getElementById("modal-connection-title").value;

        text.id = "text" + linesNum;

        // add line data to db
        addLine(line.id, inputValueConnection, divId1, divId2, x1, y1, x2, y2);
    }

    line.setAttribute("class", "lines");

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");

    line.onclick = function onclick(event) {selectItem(line.id, "line")};

    createLineObj(line.id, inputValueConnection, divId1, divId2);

    document.getElementsByTagName('svg')[0].appendChild(line);

    // create text tag for line's title
    text.innerHTML = title;

    const [x, y] = defineLineTitleCoordinates(x1, y1, x2, y2, title);

    text.setAttribute("class", "lines__text");
    
    text.setAttribute("x", x);
    text.setAttribute("y", y);

    document.getElementsByTagName('svg')[0].appendChild(text);

    // clear input and close modal window if new connection is created
    connModal.clear();
    connModal.close();
}

function getElemIdFromTitle(selectNumber) {

    let divId = "";
    let title = "";
    let select = "";

    let elements = document.getElementsByClassName("element__title");

    if (selectNumber == "first") {
        select = document.getElementById("modal-elem1");
    }
    else if (selectNumber == "second") {
        select = document.getElementById("modal-elem2");
    }

    let elems = document.querySelector('#modal-elem1').getElementsByTagName('option');

    let index = select.selectedIndex;
    console.log("index = " + index);

    for (let i = 0; i < elems.length; i++) {
        
        if (index == i) {
            title = elems[i].value;
            console.log("elems.value = " + title);
        }
    }

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerHTML == title) {
            divId = elements[i].parentElement.id;
            console.log("parentNode = " + divId);
        }
    }

    return divId;
}

function getElemCenterCoordinates(id) {
    let elemPosition = window.getComputedStyle(document.getElementById(id));
    let x = parseFloat(elemPosition.getPropertyValue("left")) + elementWidth/2;
    let y = parseFloat(elemPosition.getPropertyValue("top")) + elementWidth/2;
    console.log("x = " + x + " y = " + y);

    return [x, y];
}

// object "elements" contains information about each element's id and title

let elements = new Object();

function createElemObj(elemId, title) {
    elements[elemId] = {
        id: elemId,
        title: title
    };
}

// object "lines" contains information about which elements connected to which lines

let lines = new Object();

// creates child objects in "lines"

function createLineObj(lineId, title, divId1, divId2) {

    // child object

    lines[lineId] = {
        id: lineId,
        title: title,
        elemId1: divId1,
        elemId2: divId2
    };
}

// object "notes"

let notes = new Object();

function createNoteObj(noteId, title, text) {
    notes[noteId] = {
        id: noteId,
        title: title,
        text: text
    };
}

// finds all identifiers of lines which are connected to the draggable element

function findLineId(draggableElementId, elem, action) {

    let lineId = "";
    let lineArr = [];

    for (let i = 0; i <= lineNumber; i++) {
        //showDivs(lines["line" + i], "lines.line" + i);

        for (let key in lines["line" + i]) {
            // console.log("lines.line" + i + "." + key + " = " + (lines["line" + i])[key]);
            if ((lines["line" + i])[key] == draggableElementId) {
                // console.log("key = " + key);
                // console.log("lineId = line" + i);
                if (action == 'find') {
                    lineId = "line" + i;
                    lineArr.push(lineId);
                }
                else if (action == 'move') {
                    moveLines("line" + i, elem, key);
                }
                else if (action == 'delete') {
                    deleteLineObject(lines["line" + i], "line" + i);
                    deleteConnection("line" + i);
                    deleteLineTitle("text" + i);
                    // if the line is connected to the deleted element at the start point (divId1), we don't need to read the key (elemId2) that defines the element to which the line is connected at the end point (divId2)
                    break;
                }
            }   
        }
    }
    return lineArr;
}

// shows all properties of an object and their values

function showDivs(obj, objName) {
    for (let key in obj) {
        console.log(objName + "." + key + " = " + obj[key]);
    }
}

// moves lines connected to the draggable element

function moveLines(lineId, elem, key) {
    let linesAll = document.getElementsByTagName("line");

    for (let i = 0; i < linesAll.length; i++) {
        if ((linesAll[i].id == lineId) && (key == "elemId1")) {
            let x1 = parseFloat(elem.style.left) + elementWidth/2;
            let y1 = parseFloat(elem.style.top) + elementWidth/2;

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
            let x2 = parseFloat(elem.style.left) + elementWidth/2;
            let y2 = parseFloat(elem.style.top) + elementWidth/2;
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
        editItem("lines", lineId, "x1", x1);
        editItem("lines", lineId, "y1", y1);
        editItem("lines", lineId, "x2", x2);
        editItem("lines", lineId, "y2", y2);
    }
}

function fillElementInputs(selectedItemId) {

    let previewImg = document.getElementById("modal-load-img");
    let titleInput = document.getElementById("modal-input");

    let img = getImgSrc(selectedItemId);
    let title = getTitle(selectedItemId);

    previewImg.src = img;
    titleInput.value = title;
}

function fillConnectionInputs(selectedItemId) {

    let firstElement = document.getElementById("modal-elem1");
    let secondElement = document.getElementById("modal-elem2");
    let titleInput = document.getElementById("modal-connection-title");

    let select1 = getSelectTitle(selectedItemId, "elemId1");
    let select2 = getSelectTitle(selectedItemId, "elemId2");
    let title = findLineObjValue(selectedItemId, "title");

    firstElement.value = select1;
    secondElement.value = select2;
    titleInput.value = title;
}

function fillNotesInputs(selectedItemId) {
    let titleInput = document.getElementById("modal-note-title");
    let textInput = document.getElementById("modal-note-text");

    let title = findNoteObjValue(selectedItemId, "title");
    let text = findNoteObjValue(selectedItemId, "text");

    titleInput.value = title;
    textInput.value = text;
}

function getImgSrc(elemId) {

    let item = document.getElementById(elemId);
    let imgSrc = item.querySelector(".element__img").src;

    return imgSrc;
}

function getTitle(elemId) {

    let item = document.getElementById(elemId);

    let titleValue = item.querySelector(".element__title").innerHTML;

    return titleValue;
}

function getSelectTitle(selectedItemId, elemIdNumber) {

    let elemId = findLineObjValue(selectedItemId, elemIdNumber);

    let title = getTitle(elemId);

    return title;
}

function findElemObjValue(keyValue, keyName) {
    for (let i = 0; i <= divNumber; i++) {
        for (let key in elements["div" + i]) {
            if ((elements["div" + i])[key] == keyValue) {
                let value = (elements["div" + i])[keyName];

                return value;
            }
        }
    } 
}

function findLineObjValue(id, valueName) {
    for (let i = 0; i <= lineNumber; i++) {
        for (let key in lines["line" + i]) {
            if ((lines["line" + i])[key] == id) {
                let value = (lines["line" + i])[valueName];

                return value;
            }
        }
    } 
}

function findNoteObjValue(id, valueName) {
    for (let i = 0; i <= noteNumber; i++) {
        for (let key in notes["note" + i]) {
            if ((notes["note" + i])[key] == id) {
                let value = (notes["note" + i])[valueName];

                return value;
            }
        }
    } 
}

// creates new element

function newElement(id, title, src, x, y, createFrom) {

    let divNum = 0;

    let inputValue = document.getElementById("modal-input").value;

    console.log("submit" + inputValue);

    function check() {

        let ifTitleExists = 0;

        let div, elem_title;

        for (let i = 0; i < draggableElements.length; i++) {
            if (document.getElementsByClassName("element__title")[i].innerHTML === inputValue) {
                // if an element with the same title is found, suggests to enter a different title
                ifTitleExists++;
                messageInput.innerHTML = "This title has already been taken. Choose another one.";
                break;
            }
        }

        if (ifTitleExists == 0) {

            // add element
            div = document.createElement("div");

            // define latest div's number
            if (createFrom == "db") {
                // if we load data from db
                // update array of elements' id
                findLatestDivId(id.slice(3), "db");
                // define id
                div.id = "div" + id.slice(3);
            }
            else {
                divNum = findLatestDivId();
                // define id
                div.id = "div" + divNum;
            }
            
            // define className
            div.className = "element";

            // define positions
            if (createFrom == "db") {
                div.style.left = x;
                div.style.top = y;
            }
            else {
                let windowWidth = window.innerWidth;
                
                div.style.top = "100px";
                div.style.left = windowWidth / 2 - elementWidth / 2 + "px";
            }
            
            // put new div to container class
            document.getElementsByClassName("elements__container")[0].appendChild(div);

            // add image and title

            let elem = document.createElement("div");
            elem.className = "element__picture";
            if (createFrom == "db") {
                elem.id = "elem" + id.slice(3);
            }
            else {
                elem.id = "elem" + divNum;
            }

            document.getElementById(div.id).appendChild(elem);

            // add element's image

            let img = document.createElement("img");
            img.className = "element__img";
            if (createFrom == "db") {
                img.src = src;
            }
            else {
                img.src = imgPreview.src;
            }
            img.alt = "image";
            document.getElementById(elem.id).appendChild(img);

            // add icon for displaying selected state

            let icon = document.createElement("img");
            icon.className = "item__icon";
            icon.src = "img/icons8-idea.svg";
            icon.alt = "selected";
            document.getElementById(div.id).appendChild(icon);

            // add element's title

            elem_title = document.createElement("div");
            elem_title.className = "element__title";
            elem_title.innerHTML = "void_value";

            if (createFrom == "db") {
                elem_title.innerHTML = title;
            }
            else {
                elem_title.innerHTML = inputValue;
            }

            document.getElementById(div.id).appendChild(elem_title);

            // console.log(divNumber);

            // clear input and close modal window if new element is created
            fileInput.value = "";
            elemModal.clear();
            elemModal.close();
        } 

        // calling drag function again after creating new div
        for (let i = 0; i < draggableElements.length; i++) {
            dragElement(draggableElements[i], i, "element");
        }

        // add data to db

        if (createFrom == "db") {
            // do nothing
        }
        else {
            addItem(div.id, elem_title.innerHTML, img.src, div.style.left, div.style.top);
        }

        createElemObj(div.id, elem_title.innerHTML);
    }
    check();
}

// checks if image in "new element" modal window is selected

// add event listeners

let fileInput = document.getElementById("modal-load-file");
let imgPreview = document.getElementById("modal-load-img");
let modalElementInput = document.getElementById("modal-input");

fileInput.addEventListener('change', function() {
    previewFile();
});

// checks if image in "new element" modal window is selected

function checkIfImageIsSelected() {
    let imgPreview = document.getElementById("modal-load-img");

    if (imgPreview.classList.contains("blank")) {
        console.log("no files selected");
    }
    else {
        console.log("image is selected");
        return true;
    }
}

// checks if dropdown options in "new connection" modal window are selected

function checkDropdownOptions() {

    let selectFirstElement = document.getElementById("modal-elem1");
    let selectSecondElement = document.getElementById("modal-elem2");

    let index1 = selectFirstElement.selectedIndex;
    let index2 = selectSecondElement.selectedIndex;
    console.log("index1 = " + index1);
    console.log("index2 = " + index2);

    if ((index1 != 0) && (index2 != 0)) {
        // both options are selected
        return true;
    }
    else {
        // one of options isn't selected
    }
}

// checks if text input is empty

function checkIfInputIsEmpty(inputId) {
    
    let regex = /^[^\s]+[A-Za-z\d\s]+[^\s]$/;
    let inputValue = "";
    
    // checks which input we need to test

    // new element modal window
    if (inputId == "modal-input") {
        inputValue = document.getElementById("modal-input").value;
    }
    // new connection modal window
    else if (inputId == "modal-connection-title") {
        inputValue = document.getElementById("modal-connection-title").value;
    }

    console.log("in check " + inputValue);    

    if (regex.test(inputValue)) {
        return true;
    }
    else {
        // ...
    }
}

// event listeners for create elements, lines and notes buttons

createElemBtn.addEventListener("click", function() {
    if (checkNewElementInputs()) {
        newElement();
    }
});

createConnBtn.addEventListener("click", function() {
    if (checkNewConnectionInputs()) {
        createConnection();
    }
});

createNoteBtn.addEventListener("click", function() {
    if (checkNewNoteInputs()) {
        newNote();
    }
});

// event listeners for update elements, lines and notes buttons

updateElemBtn.addEventListener("click", function() {
    console.log("clicked");
    if (checkNewElementInputs()) {
        // update element function
        updateElem();
        elemModal.close();
    }
});

updateConnBtn.addEventListener("click", function() {
    if (checkNewConnectionInputs()) {
        // update connection function
        updateConn();
        connModal.close();
    }
});

updateNoteBtn.addEventListener("click", function() {
    if (checkNewNoteInputs()) {
        // update element function
        updateNote();
        noteModal.close();
    }
});

function updateElem() {
    let previewImg = document.getElementById("modal-load-img").src;
    let titleInput = document.getElementById("modal-input").value;
    // let inputId = "modal-input";

    editItem("elements", selectedItemId, "img", previewImg);
    editItem("elements", selectedItemId, "title", titleInput);
}

function updateConn() {
    let title = document.getElementById("modal-connection-title").value;

    let divId1 = getElemIdFromTitle("first");
    let divId2 = getElemIdFromTitle("second");

    let [x1, y1] = getElemCenterCoordinates(divId1);
    let [x2, y2] = getElemCenterCoordinates(divId2);

    editItem("lines", selectedItemId, "elem1", divId1);
    editItem("lines", selectedItemId, "elem2", divId2);
    editItem("lines", selectedItemId, "title", title);
    editItem("lines", selectedItemId, "x1", x1);
    editItem("lines", selectedItemId, "y1", y1);
    editItem("lines", selectedItemId, "x2", x2);
    editItem("lines", selectedItemId, "y2", y2);
}

function updateNote() {
    let titleInput = document.getElementById("modal-note-title").value;
    let textInput = document.getElementById("modal-note-text").value;

    editItem("notes", selectedItemId, "title", titleInput);
    editItem("notes", selectedItemId, "text", textInput);
}

// checks inputs in "new element" modal window

function checkNewElementInputs() {

    let message = messageInput;
    let inputId = "modal-input";    

    if (checkIfImageIsSelected()) {
        if (checkIfInputIsEmpty(inputId)) {
            return true;
        }
        else {
            message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
        }
    }
    else {
        if (checkIfInputIsEmpty(inputId)) {
            message.innerHTML = "No image was selected";
        }
        else {
            message.innerHTML = "All fields must contain data";
        }
    }
}

// checks inputs in "new connection" modal window

function checkNewConnectionInputs() {

    let message = messageInputConnection; 
    let inputId = "modal-connection-title";

    if (checkDropdownOptions()) {
        if (checkIfInputIsEmpty(inputId)) {
            return true;
        }
        else {
            message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
        }
    }
    else {
        if (checkIfInputIsEmpty(inputId)) {
            message.innerHTML = "One of elements isn't selected";
        }
        else {
            message.innerHTML = "All fields must contain data";
        }
    }
}

// checks inputs in "new note" modal window

function checkNewNoteInputs() {
    let titleInput = document.getElementById("modal__note-title");
    let textInput = document.getElementById("modal__note-text");

    // should we allow creating empty notes?

    return true;
}

// adds a file preview and representes the file's data as a base64 encoded string

function previewFile() {

    let file = document.getElementById("modal-load-file").files[0];
    let reader = new FileReader();
  
    reader.onloadend = function () {
        imgPreview.src = reader.result;
    }
  
    if (file) {
        reader.readAsDataURL(file);
        removeBlankClass();
    }
    else {
        setPreviewImgtoBlank();
    }
}

// find latest div's id

const divNumArr = [];

function findLatestDivId(divId, createdFrom) {

    if (createdFrom == "db") {
        divNumArr.push(divId);
        // update max id from elements' array
        divNumber = Math.max.apply(null, divNumArr);
        // console.log("divNumber = " + divNumber);
    }
    else {
        if (draggableElements.length == 0) {
            divNumber = 1;
            console.log("divNumber = " + divNumber);
        }
        else {
            divNumber = Math.max.apply(null, divNumArr);
            divNumber++;
            divNumArr.push(divNumber.toString());
            console.log("divNumber = " + divNumber);
        }
    }

    return divNumber;
}

function deleteElement(divId) {

    // find lines connected to this element and delete them

    findLineId(divId, "", 'delete');

    // delete id from array of all elements
    let number = divId.slice(3);

    const index = divNumArr.indexOf(number);

    if (index > -1) {
        divNumArr.splice(index, 1);
    }

    // delete the element

    console.log("deleteFunction");
    console.log("divId = " + divId);

    // delete data from db
    deleteItem("elements", divId);

    let elem = document.getElementById(divId);
    elem.parentNode.removeChild(elem);

    // calling drag function again after deleting a div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i, "element");
    }
}

// find latest line's id

let lineNumArr = [];

function findLatestLineID(lineId, createdFrom) {
    let linesAll = document.getElementsByTagName("line");

    if (createdFrom == "db") {
        lineNumArr.push(lineId);
        // update max id from lines' array
        lineNumber = Math.max.apply(null, lineNumArr);
        // console.log("lineNumber = " + lineNumber);
    }
    else {
        if (linesAll.length == 0) {
            lineNumber = 1;
            console.log("lineNumber = " + lineNumber);
        }
        else {
            lineNumber = Math.max.apply(null, lineNumArr);
            lineNumber++;
            lineNumArr.push(lineNumber.toString());
            console.log("lineNumber = " + lineNumber);
        }
    }

    return lineNumber;
}

function deleteLineObject(obj, lineId) {
    for (let key in obj) {
        if ((key == "id") && (obj[key] == lineId)) {
            console.log("id = " + key + " lineId = " + lineId);
            delete lines[lineId];
        }
    }
}

function deleteConnection(lineId) {

    // delete id from array of all lines
    let number = lineId.slice(4);

    const index = lineNumArr.indexOf(number);

    if (index > -1) {
        lineNumArr.splice(index, 1);
    }

    console.log("deleteConnectionFunction");
    console.log("lineId = " + lineId);

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

function deleteLineTitle(titleId) {
    console.log("deleteLineTitleFunction");
    console.log("titleId = " + titleId);

    let title = document.getElementById(titleId);
    title.parentNode.removeChild(title);
}

// notes

function newNote(id, title, text, x, y, createFrom) {

    let noteNum = 0;
    let titleInput = document.getElementById("modal-note-title").value;
    let textInput = document.getElementById("modal-note-text").value;

    // add element
    let div = document.createElement("div");

    if (createFrom == "db") {
        // if we load data from db
        // update array of elements' id
        findLatestNoteID(id.slice(4), "db");
        // define id
        div.id = "note" + id.slice(4);
    }
    else {
        noteNum = findLatestNoteID();
        div.id = "note" + noteNum;
    }

    // define className
    div.className = "note";

    // define positions
    if (createFrom == "db") {
        div.style.left = x;
        div.style.top = y;
    }
    else {
        let windowWidth = window.innerWidth;
        
        div.style.top = "100px";
        div.style.left = windowWidth / 2 - elementWidth / 2 + "px";
    }

    // put new div to container class
    document.getElementsByClassName("notes__container")[0].appendChild(div);

    // add icon for displaying selected state

    let icon = document.createElement("img");
    icon.className = "item__icon";
    icon.src = "img/icons8-idea.svg";
    icon.alt = "selected";
    document.getElementById(div.id).appendChild(icon);

    // add title

    let note_title = document.createElement("div");
    note_title.className = "note__title";
    note_title.innerHTML = "void_value";
    if (createFrom == "db") {
        note_title.innerHTML = title;
    }
    else {
        note_title.innerHTML = titleInput;
    }
    document.getElementById(div.id).appendChild(note_title);

    // add text

    let note_text = document.createElement("textarea");
    note_text.className = "note__text";
    note_text.innerHTML = "void_value";
    if (createFrom == "db") {
        note_text.innerHTML = text;
    }
    else {
        note_text.innerHTML = textInput;
    }
    document.getElementById(div.id).appendChild(note_text);

    // clear input and close modal window if new note is created
    noteModal.clear();
    noteModal.close();

    // calling drag function again after creating new div
    for (let i = 0; i < draggableNotes.length; i++) {
        dragElement(draggableNotes[i], i, "note");
    }

    // add data to db

    if (createFrom == "db") {
        // do nothing
    }
    else {
        addNoteToDB(div.id, note_title.innerHTML, note_text.innerHTML, div.style.left, div.style.top);
    }

    createNoteObj(div.id, note_title.innerHTML, note_text.innerHTML);
}

let noteNumArr = [];

function findLatestNoteID(noteID, createdFrom) {

    if (createdFrom == "db") {
        noteNumArr.push(noteID);
        // update max id from notes' array
        noteNumber = Math.max.apply(null, noteNumArr);
    }
    else {
        if (draggableNotes.length == 0) {
            noteNumber = 1;
            noteNumArr.push(noteNumber.toString());
            console.log("noteNumber = " + noteNumber);
        }
        else {
            noteNumber = Math.max.apply(null, noteNumArr);
            console.log("noteNumber = " + noteNumber);
            noteNumber++;
            noteNumArr.push(noteNumber.toString());
            console.log("noteNumber = " + noteNumber);
            console.log(noteNumArr);
        }
    }

    return noteNumber;
}

function deleteNote(noteID) {

    // delete id from array of all notes
    let number = noteID.slice(4);

    const index = noteNumArr.indexOf(number);

    if (index > -1) {
        noteNumArr.splice(index, 1);
    }

    // delete the note

    console.log("deleteFunction");
    console.log("noteId = " + noteID);

    // delete data from db
    deleteItem("notes", noteID);

    let note = document.getElementById(noteID);
    note.parentNode.removeChild(note);

    // calling drag function again after deleting a div
    for (let i = 0; i < draggableNotes.length; i++) {
        dragElement(draggableNotes[i], i, "note");
    }
}

// indexedDB

var db;

var openRequest = indexedDB.open("db", 4);

openRequest.onupgradeneeded = function(e) {
    var db = e.target.result;
    console.log("running onupgradeneeded");
    // the database did not previously exist, so create object stores
    db.createObjectStore("elements", {keyPath: "id"});
    db.createObjectStore("lines", {keyPath: "id"});
    db.createObjectStore("notes", {keyPath: "id"});
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

// add item in db

function addItem(elemId, elemTitle, elemImg, elemX, elemY) {
    var transaction = db.transaction(["elements"], "readwrite");
    var elements = transaction.objectStore("elements");
    var item = {
        id: elemId,
        title: elemTitle,
        img: elemImg,
        x: elemX,
        y: elemY,
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

// add line in db

function addLine(lineId, lineTitle, elemId1, elemId2, x1, y1, x2, y2) {
    var transaction = db.transaction(["lines"], "readwrite");
    var lines = transaction.objectStore("lines");
    var item = {
        id: lineId,
        title: lineTitle,
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

// add note in db

function addNoteToDB(id, title, text, x, y) {
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

// find item in db

function findItem(objectStoreName, elemId) {
    var transaction = db.transaction([objectStoreName], "readonly");
    var elements = transaction.objectStore(objectStoreName);
    let request = elements.get(elemId);

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

// edit item's value in db

function editItem(objectStoreName, elemId, elemTitle, elemValue) {
    let transaction = db.transaction([objectStoreName], "readwrite");
    let items = transaction.objectStore(objectStoreName);
    let request = items.get(elemId);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {

        const data = request.result;

        data[elemTitle] = elemValue;

        let requestUpdate = items.put(data);

        requestUpdate.onerror = function(e) {
            // error
            console.log("error while editing data in db");
        }
        
        requestUpdate.onsuccess = function(e) {
            // success
            // console.log("item in '" + objectStoreName + "' moved, " + "elemTitle is " + elemTitle + ", elemValue is " + elemValue);
        }
    }
}

// delete item from db

function deleteItem(objectStoreName, elemId) {
    let request = db.transaction([objectStoreName], "readwrite")
                    .objectStore(objectStoreName)
                    .delete(elemId);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("item was deleted successfully from db");
    }
}

// function to read info from db

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
                newElement(cursor.key, cursor.value.title, cursor.value.img, cursor.value.x, cursor.value.y, "db");
            }
            else if (objectStoreName == "lines") {
                createConnection(cursor.key, cursor.value.title, cursor.value.elem1, cursor.value.elem2, cursor.value.x1, cursor.value.y1, cursor.value.x2, cursor.value.y2, "db");
            }
            else if (objectStoreName == "notes") {
                newNote(cursor.key, cursor.value.title, cursor.value.text, cursor.value.x, cursor.value.y, "db");
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
        // reload the page
        document.location.reload();
    }
});

// function to delete all data from db

function deleteItems(objectStoreName) {
    let request = db.transaction([objectStoreName], "readwrite").objectStore(objectStoreName).clear();

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("all items were deleted successfully from db");
    }
}