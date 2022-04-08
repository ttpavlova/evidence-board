import { Modal } from './Modal.js';
import { model } from '../main.js';
import { findObjValue } from '../main.js';

// class for element modal window
class ElemModal extends Modal {
    constructor(window, createBtn, updateBtn) {
        super(window, createBtn, updateBtn);
    }

    // show that image isn't selected yet
    setPreviewImgtoBlank() {
        let previewImg = document.getElementById("modal-load-img");

        previewImg.src = "img/add-image.png";
        previewImg.classList.add("blank");
    }

    // remove default icon when image is selected
    removeBlankClass() {
        let previewImg = document.getElementById("modal-load-img");

        previewImg.classList.remove("blank");
    }

    // add a file preview and representes the file's data as a base64 encoded string
    previewFile() {
        let previewImg = document.getElementById("modal-load-img");
        let file = document.getElementById("modal-load-file").files[0];
        let reader = new FileReader();
    
        reader.onloadend = function () {
            previewImg.src = reader.result;
        }
    
        if (file) {
            reader.readAsDataURL(file);
            this.removeBlankClass();
        }
        else {
            this.setPreviewImgtoBlank();
        }
    }

    // fill inputs with data from db
    fillInputs() {
        let previewImg = document.getElementById("modal-load-img");
        let titleInput = document.getElementById("modal-elem-title");

        let img = findObjValue(model.elements, "img");
        let title = findObjValue(model.elements, "title");

        previewImg.src = img;
        titleInput.value = title;
    }

    // check if image is selected
    imageIsSelected() {
        let imgPreview = document.getElementById("modal-load-img");

        if (imgPreview.classList.contains("blank")) {
            console.log("no files selected");
        }
        else {
            console.log("image is selected");
            return true;
        }
    }

    // check if inputs are valid
    allInputsAreValid() {
        if (this.imageIsSelected() && this.inputIsValid()) {
            return true;
        }
        else {
            this.showErrorMessages();
        }
    }

    // show error message that explains which input is empty or incorrect
    showErrorMessages() {
        let message = document.getElementById("message-elem");

        if (this.imageIsSelected()) {
            if (!this.inputIsValid()) {
                message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
            }
        }
        else {
            if (this.inputIsValid()) {
                message.innerHTML = "No image was selected";
            }
            else {
                message.innerHTML = "All fields must contain data";
            }
        }
    }
}

export { ElemModal };