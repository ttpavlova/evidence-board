import { Modal } from './Modal.js';
import { model } from '../main.js';
import { findObjValue } from '../main.js';

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
}

export { NoteModal };