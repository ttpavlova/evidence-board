import { Modal } from './Modal.js';
import { model, notes } from '../main.js';
import { findObjValue } from './functions.js';
import { addNoteToDb } from './indexeddb.js';

// class for note modal window
class NoteModal extends Modal {
    constructor(window, createBtn, updateBtn) {
        super(window, createBtn, updateBtn);
    }

    // fill inputs with data from db
    fillInputs() {
        let titleInput = document.getElementById("modal-note-title");
        let textInput = document.getElementById("modal-note-text");

        let title = findObjValue(model.notes, "title");
        let text = findObjValue(model.notes, "text");

        titleInput.value = title;
        textInput.value = text;
    }

    // check if inputs are empty
    inputsAreEmpty() {
        let titleInput = document.getElementById("modal-note-title").value;
        let textInput = document.getElementById("modal-note-text").value;

        if ((titleInput == "") && (textInput == "")) {
            return true;
        }
    }

    // check if inputs are valid
    allInputsAreValid() {
        if (this.inputIsValid()) {
            return true;
        }
        else {
            this.showErrorMessages();
        }
    }

    // show error message that explains which input is empty or incorrect
    showErrorMessages() {
        let message = document.getElementById("message-note");

        message.innerHTML = "The title must contain 2-15 characters";
    }

    // get data from note modal window
    getItemData() {
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
}

export { NoteModal };