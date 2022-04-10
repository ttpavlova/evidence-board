import { model } from '../main.js';

let editBtn = document.getElementById("edit-item");
let deleteBtn = document.getElementById("delete-item");

let view = {
    // disable edit and delete buttons on toolbar when nothing is selected
    setEditDeleteBtnState: function() {
        if (model.ifSelectedItemExists()) {
            editBtn.classList.remove("iconDisabled");
            deleteBtn.classList.remove("iconDisabled");
        }
        else {
            editBtn.classList.add("iconDisabled");
            deleteBtn.classList.add("iconDisabled");
        }
    },

    // select item onclick
    selectItem: function(itemId, itemType) {
        // the element selected now
        let item = document.getElementById(itemId);
        let className = "";

        if ((itemType == "elem") || (itemType == "note")) {
            className = "item__selected";
            this.showIcon(itemId);
        }
        else if (itemType == "line") {
            className = "line__selected";
        }

        this.removeSelection(itemId);
        item.classList.add(className);

        model.selectedItemId = itemId; // remember id of the latest selected element
        model.selectedType = itemType; // remember if the latest selected item was element, line or note

        this.setEditDeleteBtnState();
    },

    removeSelection: function(itemId) {
        // the latest selected item
        let itemSelected = document.getElementById(model.selectedItemId);

        // if the item clicked just now is not selected already, we need to remove previous item's selection
        if (model.selectedItemId != itemId) {
            if ((model.selectedType == "elem") || (model.selectedType == "note")) {
                itemSelected.classList.remove("item__selected");
                this.hideIcon();
            }
            else if (model.selectedType == "line") {
                itemSelected.classList.remove("line__selected");
            }
        }

        model.selectedItemId = "";
        model.selectedType = "";
    },

    showIcon: function(itemId) {
        // the element selected now
        let item = document.getElementById(itemId);
        let ideaIcon = item.querySelector(".item__icon");

        ideaIcon.classList.add("icon__visible");
    },

    hideIcon: function() {
        // the latest selected item
        let itemSelected = document.getElementById(model.selectedItemId);
        let ideaIcon = itemSelected.querySelector(".item__icon");
        
        ideaIcon.classList.remove("icon__visible");
    },
}

export { view };