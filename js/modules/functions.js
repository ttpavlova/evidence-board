import { model } from '../main.js';
import { editItemInDb } from '../modules/indexeddb.js';

// drag and drop items
function dragItem(item, e, itemType) {
    e.preventDefault();
    // current coordinates of the pointer
    let pointerX = e.clientX;
    let pointerY = e.clientY;

    document.onmousemove = itemDrag;
    document.onmouseup = closeDragItem;

    function itemDrag(e) {
        // the distance between previous and new pointer coordinates
        let shiftX = e.clientX - pointerX;
        let shiftY = e.clientY - pointerY;
        // save new pointer coordinates
        pointerX = e.clientX;
        pointerY = e.clientY;
        // set new coordinates of the left-upper corner of an item
        // offsetLeft/offsetTop are X/Y-coordinates for the left/top edge of the draggable item relative to it's container
        item.style.left = item.offsetLeft + shiftX + "px";
        item.style.top = item.offsetTop + shiftY + "px";

        // move all lines connected to the draggable element
        if (itemType == "element") {
            moveLines(item.id);
        }
    }

    function closeDragItem() {
        if (itemType == "element") {
            // edit item's coordinates in db
            editItemInDb("elements", item.id, "x", item.style.left);
            editItemInDb("elements", item.id, "y", item.style.top);

            // lineArr stores identifiers of the lines connected to the draggable element
            let lineArr = getLineIdArr(item.id);
            // updates new coordinates to db after moving an element
            changeLineCoordinates(lineArr);
        }
        else if (itemType == "note") {
            // edit item's coordinates in db
            editItemInDb("notes", item.id, "x", item.style.left);
            editItemInDb("notes", item.id, "y", item.style.top);
        }
        // remove mouse events
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// generates an array of elements' identifiers
// includes all elements connected to the element selected in the dropdown list
function createArrayOfIds(elemId) {

    let idArr = [];
    for (let key in model.lines) {
        if (model.lines[key].elemId1 == elemId) {
            idArr.push(model.lines[key].elemId2);
        }
        else if (model.lines[key].elemId2 == elemId) {
            idArr.push(model.lines[key].elemId1);
        }
    }

    return idArr;
}

// generates an array of elements' titles from an array of elements' identifiers
function createArrayOfTitles(elemId) {
    
    let titleArr = [];

    let idArr = createArrayOfIds(elemId);

    for (let i = 0; i < idArr.length; i++) {
        let title = findObjValueByKeyValue(model.elements, "id", idArr[i], "title");
        titleArr.push(title);
    }

    return titleArr;
}

function getElemCenterCoordinates(id) {
    let elemPosition = window.getComputedStyle(document.getElementById(id));
    let x = parseFloat(elemPosition.getPropertyValue("left")) + model.elemWidth/2;
    let y = parseFloat(elemPosition.getPropertyValue("top")) + model.elemWidth/2;

    return [x, y];
}

// gets all identifiers of lines which are connected to the selected/draggable element
function getLineIdArr(elemId) {
    let lineArr = [];
    for (let key in model.lines) {
        if ((model.lines[key].elemId1 == elemId) || (model.lines[key].elemId2 == elemId)) {
            lineArr.push(model.lines[key].id);
        } 
    }

    return lineArr;
}

// moves lines connected to the draggable element
function moveLines(elemId) {
    for (let key in model.lines) {
        if (model.lines[key].elemId1 == elemId) {
            // if index is elemId1, the line is connected to the element at the start point, so only x1 and y1 has to be changed
            let [x1, y1] = getElemCenterCoordinates(elemId);
            let lineId = model.lines[key].id;
            let line = document.getElementById(lineId);
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);

            // move line's title
            let x2 = line.getAttribute("x2");
            let y2 = line.getAttribute("y2");
            let textId = "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            const [x, y] = countLineTitleCoordinates(x1, y1, x2, y2, text.innerHTML);
            text.setAttribute("x", x);
            text.setAttribute("y", y);
        }
        else if (model.lines[key].elemId2 == elemId) {
            let [x2, y2] = getElemCenterCoordinates(elemId);
            let lineId = model.lines[key].id;
            let line = document.getElementById(lineId);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);

            // move line's title
            let x1 = line.getAttribute("x1");
            let y1 = line.getAttribute("y1");
            let textId = "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            const [x, y] = countLineTitleCoordinates(x2, y2, x1, y1, text.innerHTML);
            text.setAttribute("x", x);
            text.setAttribute("y", y);
        }
    }
}

// gets all coordinates from the lines connected to the draggable element and writes them to db
function changeLineCoordinates(lineArr) {
    for (let i = 0; i < lineArr.length; i++) {
        let lineId = lineArr[i];
        let line = document.getElementById(lineId);
        let x1 = line.getAttribute("x1");
        let y1 = line.getAttribute("y1");
        let x2 = line.getAttribute("x2");
        let y2 = line.getAttribute("y2");

        // updates coordinates in db
        editItemInDb("lines", lineId, "x1", x1);
        editItemInDb("lines", lineId, "y1", y1);
        editItemInDb("lines", lineId, "x2", x2);
        editItemInDb("lines", lineId, "y2", y2);
    }
}

// calculate the width of the text above the line
function countLineTitleCoordinates(x1, y1, x2, y2, title) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = "18px Montserrat, sans-serif";

    let text = ctx.measureText(title); // TextMetrics object
    // console.log("text.width = " + text.width);

    // result
    x1 = parseFloat(x1);
    y1 = parseFloat(y1);
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);

    let x = x1 + (x2 - x1) / 2 - text.width / 2;
    let y = y1 + (y2 - y1) / 2;
    
    // console.log("x = " + x + ", y = " + y);

    return [x, y];
}

// finds value by selected item's id
function findObjValue(obj, indexName) {
    for (let key in obj) {
        if (obj[key].id == model.selectedItemId) {
            return((obj[key])[indexName]);
        }
    }
}

// finds searchIndex's value with knownIndex and knownValue
function findObjValueByKeyValue(obj, knownIndex, knownValue, searchIndex) {
    for (let key in obj) {
        if ((obj[key])[knownIndex] == knownValue) {
            return((obj[key])[searchIndex]);
        }
    }
}

// get item from array of objects
function getObj(obj, id) {
    for (let key in obj) {
        if (obj[key].id == id) {
            return obj[key];
        }
    }
}

// deletes an object
function deleteObj(obj, indexName, value) {
    for (let key in obj) {
        if ((obj[key])[indexName] == value) {
            delete obj[key];
        }
    }
}

// checks if value is taken
function isValueTaken(obj, indexName, value) {
    for (let key in obj) {
        if ((obj[key])[indexName] == value) {
            return true;
        }
    }
}

export { dragItem, createArrayOfIds, createArrayOfTitles, getElemCenterCoordinates, getLineIdArr, moveLines, changeLineCoordinates, countLineTitleCoordinates, findObjValue, findObjValueByKeyValue, getObj, deleteObj, isValueTaken };