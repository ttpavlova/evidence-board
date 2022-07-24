import { view } from './modules/view.js';
import { exportFile } from './modules/export.js';
import { zoom, setZoomValue, changeMainHeight } from './modules/zoom.js';
import { ElemModal } from './modules/ElemModal.js';
import { ConnModal } from './modules/ConnModal.js';
import { NoteModal } from './modules/NoteModal.js';
import { itemType } from './modules/ItemType.js';
import { addElementToPage, addLineToPage, addNoteToPage } from './modules/addItemToPage.js';
import { updateElem, updateConn, updateNote } from './modules/updateItem.js';
import { deleteElement, deleteConnection, deleteNote } from './modules/deleteItem.js';
import { clearObjStore } from './modules/indexeddb.js';

function init() {
    setZoomValue();
    changeMainHeight();
}

window.onload = init;

let model = {
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

let elements = new itemType();
let lines = new itemType();
let notes = new itemType();

// toolbar

// export

let exportBtn = document.getElementById("export");

exportBtn.addEventListener("click", function() {
    exportFile();
});

// zoom

let zoomInBtn = document.getElementById("zoom-in");
let zoomOutBtn = document.getElementById("zoom-out");

zoomInBtn.addEventListener("click", function() {
    zoom("in");
});
zoomOutBtn.addEventListener("click", function() {
    zoom("out");
});

// button for opening modal window in edit mode
let editBtn = document.getElementById("edit-item");
// delete item button
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
    view.setEditDeleteBtnState();
});

// set edit and delete buttons to disabled by default
view.setEditDeleteBtnState();

// buttons for opening modal windows in create mode
let newElemBtn = document.getElementById("new-element");
let newConnBtn = document.getElementById("new-connection");
let newNoteBtn = document.getElementById("new-note");

// element modal window

let elemModal = new ElemModal("modal-element", "create-elem-btn", "update-elem-btn");
elemModal.setPreviewImgtoBlank();

newElemBtn.addEventListener("click", function() {
    elemModal.open();
    elemModal.showCreateBtn();
});

let closeElemModalBtn = document.getElementById("close-elem-modal");

closeElemModalBtn.addEventListener("click", function() {
    elemModal.clear();
    elemModal.setPreviewImgtoBlank();
    elemModal.close();
});

// connection modal window

let connModal = new ConnModal("modal-connection", "create-conn-btn", "update-conn-btn");

let selectFirstElement = document.getElementById("modal-elem1");
let selectSecondElement = document.getElementById("modal-elem2");

newConnBtn.addEventListener("click", function() {
    connModal.open();
    connModal.fillSelectOptions();
    connModal.showCreateBtn();
});

let closeConnModalBtn = document.getElementById("close-conn-modal");

closeConnModalBtn.addEventListener("click", function() {
    connModal.clear();
    connModal.clearSelectOptions();
    connModal.setPreviewImgToBlank("preview-img-1");
    connModal.setPreviewImgToBlank("preview-img-2");
    connModal.close();
});

// note modal window

let noteModal = new NoteModal("modal-note", "create-note-btn", "update-note-btn");

newNoteBtn.addEventListener("click", function() {
    noteModal.open();
    noteModal.showCreateBtn();
});

let closeNoteModalBtn = document.getElementById("close-note-modal");

closeNoteModalBtn.addEventListener("click", function() {
    noteModal.clear();
    noteModal.close();
});

// change img preview

let fileInput = document.getElementById("modal-load-file");

fileInput.addEventListener("change", function() {
    elemModal.previewFile();
});

// eventlistener to disable option if it's already selected in another dropdown

selectFirstElement.addEventListener("change", function() {
    connModal.disableUnavalilableSelectOptions("modal-elem1", "modal-elem2");
});

selectSecondElement.addEventListener("change", function() {
    connModal.disableUnavalilableSelectOptions("modal-elem2", "modal-elem1");
});

// buttons inside modal windows to create/update item

let createElemBtn = document.getElementById("create-elem-btn");
let updateElemBtn = document.getElementById("update-elem-btn");

let createConnBtn = document.getElementById("create-conn-btn");
let updateConnBtn = document.getElementById("update-conn-btn");

let createNoteBtn = document.getElementById("create-note-btn");
let updateNoteBtn = document.getElementById("update-note-btn");

// event listeners for creating elements, lines and notes buttons

createElemBtn.addEventListener("click", function() {
    if (elemModal.allInputsAreValid()) {
        // get the data from modal window and put the new item into the db
        let [id, title, img, x, y] = elemModal.getItemData();
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
        let [id, title, elemId1, elemId2, x1, y1, x2, y2] = connModal.getItemData();
        addLineToPage(id, title, elemId1, elemId2, x1, y1, x2, y2);

        // clear the inputs and close modal window
        connModal.clear();
        connModal.clearSelectOptions();
        connModal.setPreviewImgToBlank("preview-img-1");
        connModal.setPreviewImgToBlank("preview-img-2");
        connModal.close();
    }
});

createNoteBtn.addEventListener("click", function() {
    if (noteModal.allInputsAreValid()) {
        let [id, title, text, x, y] = noteModal.getItemData();
        addNoteToPage(id, title, text, x, y);

        // clear the inputs and close modal window
        noteModal.clear();
        noteModal.close();
    }
});

// event listeners for updating elements, lines and notes buttons

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
        connModal.setPreviewImgToBlank("preview-img-1");
        connModal.setPreviewImgToBlank("preview-img-2");
        connModal.close();
    }
});

updateNoteBtn.addEventListener("click", function() {
    if (noteModal.allInputsAreValid()) {
        updateNote();
        noteModal.clear();
        noteModal.close();
    }
});

// clear all data button
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

// area that doesn't include svg lines
let background = document.getElementById("background");

background.addEventListener("click", function() {
    if (model.selectedItemId != "") {
        view.removeSelection();
    }

    view.setEditDeleteBtnState();
});

export { model, elements, lines, notes };