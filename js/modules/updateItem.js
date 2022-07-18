import { model } from '../main.js';
import { getObj, findObjValueByKeyValue, getElemCenterCoordinates, countLineTitleCoordinates } from './functions.js';
import { editItemInDb } from './indexeddb.js';

function updateElem() {
    let previewImg = document.getElementById("modal-load-img").src;
    let titleInput = document.getElementById("modal-elem-title").value.trim();

    // update data in db
    editItemInDb("elements", model.selectedItemId, "img", previewImg);
    editItemInDb("elements", model.selectedItemId, "title", titleInput);

    // update data in object
    let obj = getObj(model.elements, model.selectedItemId);
    obj.img = previewImg;
    obj.title = titleInput;

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
    let titleInput = document.getElementById("modal-conn-title").value.trim();

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
    let obj = getObj(model.lines, model.selectedItemId);
    obj.elemId1 = elemId1;
    obj.elemId2 = elemId2;
    obj.title = titleInput;
    obj.x1 = x1;
    obj.y1 = y1;
    obj.x2 = x2;
    obj.y2 = y2;

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
    let titleInput = document.getElementById("modal-note-title").value.trim();
    let textInput = document.getElementById("modal-note-text").value;

    // update data in db
    editItemInDb("notes", model.selectedItemId, "title", titleInput);
    editItemInDb("notes", model.selectedItemId, "text", textInput);

    // update data in object
    let obj = getObj(model.notes, model.selectedItemId);
    obj.title = titleInput;
    obj.text = textInput;

    // update data on screen
    let item = document.getElementById(model.selectedItemId);
    let title = item.querySelector(".note__title");
    title.innerHTML = titleInput;
    let text = item.querySelector(".note__text");
    text.innerHTML = textInput;
}

export { updateElem, updateConn, updateNote };