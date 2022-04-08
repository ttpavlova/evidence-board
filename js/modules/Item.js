import { model, view } from '../main.js';

// item class
class Item {
    constructor() {
        // selected: false;
    }

    // select item onclick
    selectItem(itemId, itemType) {
        // the element selected now
        let item = document.getElementById(itemId);
        let className = "";

        if ((itemType == "elem") || (itemType == "note")) {
            className = "item__selected";
            view.showIcon(itemId);
        }
        else if (itemType == "line") {
            className = "line__selected";
        }

        view.removeSelection(itemId);
        item.classList.add(className);

        model.selectedItemId = itemId; // remember id of the latest selected element
        model.selectedType = itemType; // remember if the latest selected item was element, line or note

        view.setEditDeleteBtnState();
    }
}

export { Item };