import { Modal } from './Modal.js';
import { model, elements } from '../main.js';
import { findObjValue, isValueTaken } from './functions.js';
import { addElementToDb } from './indexeddb.js';

// class for element modal window
class ElemModal extends Modal {
    constructor(window, createBtn, updateBtn) {
        super(window, createBtn, updateBtn);
    }

    // show that image isn't selected yet
    setPreviewImgtoBlank() {
        let previewImg = document.getElementById("modal-load-img");

        previewImg.src = "img/add_photo_alternate_black_48dp.svg";
        previewImg.classList.add("preview__img_blank");
    }

    // remove default icon when image is selected
    removeBlankClass() {
        let previewImg = document.getElementById("modal-load-img");

        previewImg.classList.remove("preview__img_blank");
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

        if (imgPreview.classList.contains("preview__img_blank")) {
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
                message.innerHTML = "Title must contain 2-15 characters and cannot start or end with a whitespace";
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

    // get data from element modal window
    getItemData() {
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
}

export { ElemModal };