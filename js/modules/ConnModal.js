import { Modal } from './Modal.js';
import { model } from '../main.js';
import { findObjValue, findObjValueByKeyValue } from '../main.js';
import { createArrayOfTitles } from '../main.js';

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
                message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
            }
        }
        else {
            if (this.inputIsValid()) {
                message.innerHTML = "One of elements isn't selected";
            }
            else {
                message.innerHTML = "All fields must contain data";
            }
        }
    }
}

export { ConnModal };