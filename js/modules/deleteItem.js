import { model, elements, lines, notes } from '../main.js';
import { getLineIdArr, deleteObj } from './functions.js';
import { deleteItemFromDb } from './indexeddb.js';

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

export { deleteElement, deleteConnection, deleteNote };