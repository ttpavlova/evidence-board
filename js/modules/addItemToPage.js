import { model, elements, lines, notes } from '../main.js';
import { view } from './view.js';
import { Element } from './Element.js';
import { Connection } from './Connection.js';
import { Note } from './Note.js';
import { dragItem, countLineTitleCoordinates } from './functions.js';

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
        view.selectItem(elem.id, "elem");
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
        view.selectItem(line.id, "line");
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
        view.selectItem(note.id, "note");
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

export { addElementToPage, addLineToPage, addNoteToPage };