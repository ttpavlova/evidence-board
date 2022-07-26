import { Modal } from './Modal.js';
import { model, lines } from '../main.js';
import { findObjValue, findObjValueByKeyValue, getElemCenterCoordinates, createArrayOfTitles } from './functions.js';
import { addLineToDb } from './indexeddb.js'; 

let selectFirstElement = document.getElementById("modal-elem1");
let selectSecondElement = document.getElementById("modal-elem2");

// class for connection modal window
class ConnModal extends Modal {
    constructor(window, createBtn, updateBtn) {
        super(window, createBtn, updateBtn);
    }

    // fill both dropdown lists with options
    fillSelectOptions() {
        let elements = document.getElementsByClassName("element__title");

        for (let i = 0; i < elements.length; i++) {
            let option = elements[i].innerHTML;

            let elem = document.createElement("option");
            elem.className = "select__option";
            elem.textContent = option;
            elem.value = option;
            selectFirstElement.appendChild(elem);

            let elem2 = elem.cloneNode(true);
            selectSecondElement.appendChild(elem2);
        }
    }

    // clear options in dropdown lists
    clearSelectOptions() {
        let num = selectFirstElement.options.length - 1;
        for (let i = num; i > 0; i--) {
            selectFirstElement.remove(i);
            selectSecondElement.remove(i);
        }
    }

    // set disabled state to options which cannot be selected
    disableUnavalilableSelectOptions(currentSelectId, anotherSelectId) {
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

        // show an image of the selected option
        this.showPreviewImg(elemId, currentSelectId);
    }

    // fill inputs with data from db
    fillInputs() {
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

    // check if dropdown options are selected
    dropdownOptionsAreSelected() {
        let index1 = selectFirstElement.selectedIndex;
        let index2 = selectSecondElement.selectedIndex;

        if ((index1 != 0) && (index2 != 0)) {
            // both options are selected
            return true;
        }
    }

    // checks if inputs are valid
    allInputsAreValid = function() {
        if (this.dropdownOptionsAreSelected() && this.inputIsValid()) {
            return true;
        }
        else {
            this.showErrorMessages();
        }
    }

    // show error message that explains which input is empty or incorrect
    showErrorMessages = function() {
        let message = document.getElementById("message-conn");

        if (this.dropdownOptionsAreSelected()) {
            if (!this.inputIsValid()) {
                message.innerHTML = "The title must contain 1-25 characters";
            }
        }
        else {
            if (this.inputIsValid()) {
                message.innerHTML = "Options in both dropdown lists should be selected";
            }
            else {
                message.innerHTML = "All fields must contain data";
            }
        }
    }

    // add blank class when nothing is selected in the dropdown list
    setPreviewImgToBlank(id) {
        let previewImg = document.getElementById(id);

        previewImg.src = "img/image_black_48dp.svg";
        previewImg.classList.add("preview__img_blank");
    }

    // remove default icon when image is selected
    removeBlankClass(id) {
        let previewImg = document.getElementById(id);

        previewImg.classList.remove("preview__img_blank");
    }

    // show a preview image when one of the options in the dropdown list is selected
    showPreviewImg(elemId, dropdownListId) {
        let lastStringChar = dropdownListId.slice(dropdownListId.length - 1);
        let previewImgId = "preview-img-" + lastStringChar;
        if (elemId != undefined) {
            let img = findObjValueByKeyValue(model.elements, "id", elemId, "img");
            let previewImg = document.getElementById(previewImgId);
            previewImg.src = img;
            this.removeBlankClass(previewImgId);
        }
        else {
            // if "Choose an element" option is selected, set preview img to default
            this.setPreviewImgToBlank(previewImgId);
        }
    }

    // get data from connection modal window
    getItemData() {
        let elemTitle1 = document.getElementById("modal-elem1").value;
        let elemTitle2 = document.getElementById("modal-elem2").value;
        let inputValue = document.getElementById("modal-conn-title").value.trim();

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
}

export { ConnModal };