// drag'n'drop elements

let draggableElements = document.getElementsByClassName("element");

for (let i = 0; i < draggableElements.length; i++) {
    dragElement(draggableElements[i], i);
    
}

function dragElement(elem, i) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (document.getElementById(elem.id)) {
        document.getElementById(elem.id).onmousedown = dragMouseDown;
    }
    else {
        elem.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";

        // find element in db
        findItem(draggableElements[i].id);

        // edit element's coordinates in db
        editItem("elements", draggableElements[i].id, "x", elem.style.left);
        editItem("elements", draggableElements[i].id, "y", elem.style.top);

        // определим id элемента, который мы передвигаем
        console.log(draggableElements[i].id);

        // получим id линий, которые присоединены к этому элементу
        findLineId(draggableElements[i].id, elem, 'move');
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// variables

let i = 0;

let newItem = document.getElementById("new-element");

let modalWindow = document.getElementById("modal-element");
let modalWindowConnection = document.getElementById("modal-connection");

//let closeBtn = document.getElementById("close-btn");
let closeBtn = document.querySelector("modal__close");

let inputValue = document.getElementById("modal-input").value;

let submitBtn = document.getElementById("modal-submit");
let connectionBtn = document.getElementById("modal-submit-connection");

let messageInput = document.getElementById("message-input");
let messageInputConnection = document.getElementById("message-input-connection");

let divNumber = 0;
let lineNumber = 0;

submitBtn.disabled = true;
connectionBtn.disabled = true;

let firstDropdownElement = 0;
let secondDropdownElement = 0;

// fills both dropdown lists with options

function fillSelect() {
    let elements = document.getElementsByClassName("element__title");

    let selectFirstElement = document.getElementById("modal-elem1");
    let selectSecondElement = document.getElementById("modal-elem2");
    let inputConnection = document.getElementById("modal-connection-title");

    let elems = document.querySelector('#modal-elem1').getElementsByTagName('option');

    for (let i = 0; i < elements.length; i++) {
        let option = elements[i].innerHTML;

        let elem = document.createElement("option");
        elem.textContent = option;
        elem.value = option;
        selectFirstElement.appendChild(elem);

        let elem2 = elem.cloneNode(true);
        selectSecondElement.appendChild(elem2);
    }

    // eventlistener to disable option if it's already selected in another dropdown

    selectFirstElement.addEventListener('change', function() {
        console.log(selectFirstElement.selectedIndex);
        // ...
        firstDropdownElement = selectFirstElement.selectedIndex;
        checkNewConnectionInputs();
        for (i = 1; i < elems.length; i++) {
            // remove disabled state on every element until we find the new chosen one
            selectSecondElement[i].disabled = false;
            if (selectFirstElement.selectedIndex == i) {
                selectSecondElement[i].disabled = true;
            }
            
        }
    });

    selectSecondElement.addEventListener('change', function() {
        console.log(selectSecondElement.selectedIndex);
        // ...
        secondDropdownElement = selectSecondElement.selectedIndex;
        checkNewConnectionInputs();
        for (i = 1; i < elems.length; i++) {
            selectFirstElement[i].disabled = false;
            if (selectSecondElement.selectedIndex == i) {
                selectFirstElement[i].disabled = true;
            }            
        } 
    });

    inputConnection.addEventListener('change', function() {
        console.log("text in inputConnection changed");
        checkNewConnectionInputs();
    });
}

// clears options in dropdown lists

function clearSelect() {
    let i = 0;
    let selectFirstElement = document.getElementById("modal-elem1");
    let selectSecondElement = document.getElementById("modal-elem2");
    let num = selectFirstElement.options.length - 1;

    for (i = num; i > 0; i--) {
        selectFirstElement.remove(i);
        selectSecondElement.remove(i);
    }
}

// creates a line between two selected elements

function createConnection(lineId, lineTitle, elemId1, elemId2, line_x1, line_y1, line_x2, line_y2, createFrom) {

    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    let linesNum = 0;
    let x1, y1, x2, y2 = 0;
    let inputValueConnection = "";
    let divId1 = "";
    let divId2 = "";
    let title1 = "";
    let title2 = "";

    // create text tag for line's title
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let title = "";

    if (createFrom == "db") {
        inputValueConnection = lineTitle;
        divId1 = elemId1;
        divId2 = elemId2;
        x1 = line_x1;
        y1 = line_y1;
        x2 = line_x2;
        y2 = line_y2;
        console.log("in db case: ");
        console.log("x1 = " + x1 + " y1 = " + y1);
        console.log("x2 = " + x2 + " y2 = " + y2);

        linesNum = findLatestLineID(lineId.slice(4), "db");

        line.id = lineId;

        text.id = "text" + lineId.slice(4);
        // text title
        title = lineTitle;
    }
    else {
        inputValueConnection = document.getElementById("modal-connection-title").value;

        let elements = document.getElementsByClassName("element__title");

        let selectFirstElement = document.getElementById("modal-elem1");
        let selectSecondElement = document.getElementById("modal-elem2");

        let elems = document.querySelector('#modal-elem1').getElementsByTagName('option');

        let index1 = selectFirstElement.selectedIndex;
        let index2 = selectSecondElement.selectedIndex;
        console.log("index1 = " + index1);
        console.log("index2 = " + index2);

        for (let i = 0; i < elems.length; i++) {
            
            if (index1 == i) {
                title1 = elems[i].value;
                console.log("elems.value = " + title1);
            }

            if (index2 == i) {
                title2 = elems[i].value;
                console.log("elems.value = " + title2);
            }
        }

        for (i = 0; i < elements.length; i++) {
            if (elements[i].innerHTML == title1) {
                divId1 = elements[i].parentElement.id;
                console.log("parentNode = " + divId1);
            }

            if (elements[i].innerHTML == title2) {
                divId2 = elements[i].parentElement.id;
                console.log("parentNode = " + divId2);
            }
        }

        // get (x;y) of div1 and div2

        let styleFirstElement = window.getComputedStyle(document.getElementById(divId1));
        x1 = parseFloat(styleFirstElement.getPropertyValue("left")) + 100;
        y1 = parseFloat(styleFirstElement.getPropertyValue("top")) + 100;
        console.log("x1 = " + x1 + " y1 = " + y1);

        let styleSecondElement = window.getComputedStyle(document.getElementById(divId2));
        x2 = parseFloat(styleSecondElement.getPropertyValue("left")) + 100;
        y2 = parseFloat(styleSecondElement.getPropertyValue("top")) + 100;
        console.log("x2 = " + x2 + " y2 = " + y2);

        linesNum = findLatestLineID();

        line.id = "line" + linesNum;

        // create text tag for line's title
        title = document.getElementById("modal-connection-title").value;

        text.id = "text" + linesNum;

        // add line data to db
        addLine(line.id, inputValueConnection, divId1, divId2, x1, y1, x2, y2);
    }

    line.setAttribute("class", "lines");

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");

    findConnectedDivs(line.id, inputValueConnection, divId1, divId2);

    document.getElementsByTagName('svg')[0].appendChild(line);

    // create text tag for line's title
    text.innerHTML = title;

    const [x, y] = defineLineTitleCoordinates(x1, y1, x2, y2, title);
    
    text.setAttribute("x", x);
    text.setAttribute("y", y);

    document.getElementsByTagName('svg')[0].appendChild(text);
}

// object "lines" contains information about which elements connected to which lines

lines = new Object();

// creates child objects in "lines"

function findConnectedDivs(lineId, title, divId1, divId2) {

    console.log(lines);

    // child object

    lines[lineId] = {
        id: lineId,
        title: title,
        elemId1: divId1,
        elemId2: divId2
    };

    console.log(lines[lineId].id, lines[lineId].title, lines[lineId].elemId1, lines[lineId].elemId2);

}

// finds all identifiers of lines which are connected to the draggable element

function findLineId(draggableElementId, elem, action) {

    console.log("lineNumber = " + lineNumber);

    for (i = 0; i <= lineNumber; i++) {
        //showDivs(lines["line" + i], "lines.line" + i);

        for (let key in lines["line" + i]) {
            // console.log("lines.line" + i + "." + key + " = " + (lines["line" + i])[key]);
            if ((lines["line" + i])[key] == draggableElementId) {
                // console.log("key = " + key);
                // console.log("lineId = line" + i);
                if (action == 'move') {
                    moveLines("line" + i, elem, key);
                }
                else if (action == 'delete') {
                    deleteLineObject(lines["line" + i], "line" + i);
                    deleteConnection("line" + i);
                    deleteLineTitle("text" + i);
                    // if the line is connected to the deleted element at the start point (divId1), we don't need to read the key (elemId2) that defines the element to which the line is connected at the end point (divId2)
                    break;
                }
            }   
        }
    }
}

// shows all properties of an object and their values

function showDivs(obj, objName) {
    for (let key in obj) {
        console.log(objName + "." + key + " = " + obj[key]);
    }
}

// moves lines connected to the draggable element

function moveLines(lineId, elem, key) {
    let linesAll = document.getElementsByTagName("line");

    for (let i = 0; i < linesAll.length; i++) {
        if ((linesAll[i].id == lineId) && (key == "elemId1")) {
            let x1 = parseFloat(elem.style.left) + 100;
            let y1 = parseFloat(elem.style.top) + 100;

            linesAll[i].setAttribute("x1", x1);
            linesAll[i].setAttribute("y1", y1);

            // move line's title

            let x2 = linesAll[i].getAttribute("x2");
            let y2 = linesAll[i].getAttribute("y2");

            let textId = "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            // console.log("text = " + textId);

            const [x, y] = defineLineTitleCoordinates(x1, y1, x2, y2, text.innerHTML);

            text.setAttribute("x", x);
            text.setAttribute("y", y);

            // update data in db
            editItem("lines", lineId, "x1", x1);
            editItem("lines", lineId, "y1", y1);
            editItem("lines", lineId, "x2", x2);
            editItem("lines", lineId, "y2", y2);
        }
        else if ((linesAll[i].id == lineId) && (key == "elemId2")) {
            let x2 = parseFloat(elem.style.left) + 100;
            let y2 = parseFloat(elem.style.top) + 100;
            linesAll[i].setAttribute("x2", x2);
            linesAll[i].setAttribute("y2", y2);

            // move line's title

            let x1 = linesAll[i].getAttribute("x1");
            let y1 = linesAll[i].getAttribute("y1");

            let textId= "text" + lineId.slice(4);
            let text = document.getElementById(textId);
            // console.log("text = " + textId);

            const [x, y] = defineLineTitleCoordinates(x2, y2, x1, y1, text.innerHTML);

            text.setAttribute("x", x);
            text.setAttribute("y", y);

            // update data in db
            editItem("lines", lineId, "x1", x1);
            editItem("lines", lineId, "y1", y1);
            editItem("lines", lineId, "x2", x2);
            editItem("lines", lineId, "y2", y2);
        }
    }
}

// modal

// opens modal window

function openModal(elem) {

    fillSelect();

    // counts the amount of created elements

    let num = 0;

    for (i = 0; i < draggableElements.length; i++) {
        num = i + 1;
    }

    if (elem === 'elem') {
        modalWindow.classList.add("modal__open");
        console.log("num in newElement() " + num);
    }
    else {
        modalWindowConnection.classList.add("modal__open");
        console.log("num in newConnection() " + num);
    }
}

// closes modal window

function closeModal(elem) {

    if (elem === 'elem') {
        modalWindow.classList.remove("modal__open");
    }
    else {
        modalWindowConnection.classList.remove("modal__open");
    }

    clearSelect();
}

// creates new element

function newElement(id, title, src, x, y, createFrom) {

    inputValue = document.getElementById("modal-input").value;

    console.log("submit" + inputValue);

    function check() {

        let ifTitleExists = 0;

        for (let i = 0; i < draggableElements.length; i++) {
            if (document.getElementsByClassName("element__title")[i].innerHTML === inputValue) {
                // if an element with the same title is found, suggests to enter a different title
                ifTitleExists++;
                messageInput.innerHTML = "This title has already been taken. Choose another one.";
                break;
            }
            else {
                messageInput.innerHTML = "This title is ok.";
            }
        }

        if (ifTitleExists == 0) {

            // add element
            var div = document.createElement("div");

            let num = 0;
            
            console.log("i до подсчёта elements = " + num);
            for (i = 0; i < draggableElements.length; i++) {
                num++;
            }
            num = num + 1;
            console.log("i после подсчёта elements = " + num);

            // define latest div's number
            if (createFrom == "db") {
                // if we load data from db
                divNumber = findLatestDivId(id.slice(3), "db");
            }
            else {
                divNumber = findLatestDivId();
            }
            
            // define className
            div.className = "element";

            // define id
            div.id = "div" + divNumber;

            // define positions
            if (createFrom == "db") {
                div.style.left = x;
                div.style.top = y;
            }
            else {
                if (num > 0) {
                    div.style.left = 50 + (num-1)*200 + (num-1)*100 + "px";
                }
                else {
                    div.style.left = 50 + num*200 + num*100 + "px";
                }
                // div.style.left = "50px";
                div.style.top = "50px";
            }
            
            // put new div to container class
            document.getElementsByClassName('container')[0].appendChild(div);

            // add image and title

            var elem = document.createElement("div");
            elem.className = "element__picture";
            elem.id = "elem" + divNumber;

            document.getElementById(div.id).appendChild(elem);

            // add element's image

            var img = document.createElement("img");
            img.className = "element__img";
            if (createFrom == "db") {
                img.src = src;
            }
            else {
                img.src = imgPreview.src;
            }
            img.alt = "image";
            document.getElementById(elem.id).appendChild(img);

            // add delete button

            var span = document.createElement("span");
            span.className = "element__delete";
            span.onclick = function onclick(event) {deleteElement(div.id); deleteItem("elements", div.id)};
            span.innerHTML = "&times;";
            document.getElementById(elem.id).appendChild(span);

            // add element's title

            var elem_title = document.createElement("div");
            elem_title.className = "element__title";
            elem_title.innerHTML = "void_value";

            if (createFrom == "db") {
                elem_title.innerHTML = title;
            }
            else {
                elem_title.innerHTML = inputValue;
            }

            document.getElementById(div.id).appendChild(elem_title);

            console.log(divNumber);

            // clear input and close modal window if new element is created

            fileInput.value = "";
            document.getElementById("modal-input").value = "";
            document.getElementById("modal-load-img").src = "";
            messageInput.innerHTML = "";
            submitBtn.disabled = true;
            closeModal('elem');
        } 

        // calling drag function again after creating new div
        for (let i = 0; i < draggableElements.length; i++) {
            dragElement(draggableElements[i], i);
        }

        // add data to db

        if (createFrom == "db") {
            // do nothing
        }
        else {
            addItem(div.id, elem_title.innerHTML, img.src, div.style.left, div.style.top);
        }
    }
    check();
}

// checks if image in "new element" modal window is selected

// add event listeners

let fileInput = document.getElementById("modal-load-file");
let imgPreview = document.getElementById("modal-load-img");
let modalElementInput = document.getElementById("modal-input");

fileInput.addEventListener('change', function() {
    checkNewElementInputs();
    previewFile();
});

modalElementInput.addEventListener('change', function() {
    checkNewElementInputs();
});

// checks if image in "new element" modal window is selected

function checkIfImageIsSelected() {
    let img = document.getElementById("modal-load-file");

    if (img.files.length == 0) {
        console.log("no files selected");
    }
    else {
        console.log("image is selected");
        return true;
    }
}

// checks if dropdown options in "new connection" modal window are selected

function checkDropdownOptions() {

    if ((firstDropdownElement != 0) && (secondDropdownElement != 0)) {
        // both options are selected
        return true;
    }
    else {
        // one of options isn't selected
    }
}

// checks if text input is empty

function checkIfInputIsEmpty(inputId) {
    
    let regex = /^[^\s]+[A-Za-z\d\s]+[^\s]$/;
    
    // checks which input we need to test

    // new element modal window
    if (inputId == "modal-input") {
        inputValue = document.getElementById("modal-input").value;
    }
    // new connection modal window
    else if (inputId == "modal-connection-title") {
        inputValue = document.getElementById("modal-connection-title").value;
    }

    console.log("in check " + inputValue);    

    if (regex.test(inputValue)) {
        return true;
    }
    else {
        // ...
    }
}

// checks inputs in "new element" modal window

function checkNewElementInputs() {

    let btn = submitBtn;
    let message = messageInput;
    let inputId = "modal-input";

    if (checkIfImageIsSelected()) {
        if (checkIfInputIsEmpty(inputId)) {
            message.innerHTML = "Input accepted";
            btn.disabled = false;
        }
        else {
            message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
            btn.disabled = true;
        }
    }
    else {
        if (checkIfInputIsEmpty(inputId)) {
            message.innerHTML = "No image was selected";
            btn.disabled = true;
        }
        else {
            message.innerHTML = "All fields must contain data";
            btn.disabled = true;
        }
    }
}

// checks inputs in "new connection" modal window

function checkNewConnectionInputs() {

    let btn = connectionBtn;
    let message = messageInputConnection; 
    let inputId = "modal-connection-title";

    if (checkDropdownOptions()) {
        if (checkIfInputIsEmpty(inputId)) {
            message.innerHTML = "Input accepted";
            btn.disabled = false;
        }
        else {
            message.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace";
            btn.disabled = true;
        }
    }
    else {
        if (checkIfInputIsEmpty(inputId)) {
            message.innerHTML = "One of elements isn't selected";
            btn.disabled = true;
        }
        else {
            message.innerHTML = "All fields must contain data";
            btn.disabled = true;
        }
    }
}

// adds a file preview and representes the file's data as a base64 encoded string

function previewFile() {

    let file = document.getElementById("modal-load-file").files[0];
    let reader = new FileReader();
  
    reader.onloadend = function () {
        imgPreview.src = reader.result;
    }
  
    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        imgPreview.src = "";
    }
}

//localStorage.clear();

// find latest div's id

function findLatestDivId(divId, createdFrom) {
    if (createdFrom == "db") {
        divNumber = divId;
        console.log("divNumber = " + divNumber);
    }
    else {
        if (draggableElements.length == 0) {
            divNumber = 1;
            console.log("divNumber = " + divNumber);
        }
        else {
            for (i = 0; i < draggableElements.length; i++) {
                divId = draggableElements[i].id;
                divNumber = divId.slice(3);
                divNumber++;
                console.log("divNumber = " + divNumber);
            }
        }
    }

    return divNumber;
}

function deleteElement(divId) {

    // find lines connected to this element and delete them

    findLineId(divId, "", 'delete');

    // delete the element

    console.log("deleteFunction");
    console.log("divId = " + divId);

    let elem = document.getElementById(divId);
    elem.parentNode.removeChild(elem);

    // calling drag function again after deleting a div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i);
    }
}

// find latest line's id 

function findLatestLineID(lineId, createdFrom) {
    let linesAll = document.getElementsByTagName("line");
    let svg = document.getElementById("svg");

    if (createdFrom == "db") {
        lineNumber = lineId;
        console.log("lineNumber = " + lineNumber);
    }
    else {
        if (linesAll.length == 0) {
            lineNumber = 1;
            console.log("lineNumber = " + lineNumber);
        }
        else {
            let lineId = svg.lastElementChild.id;
            lineNumber = lineId.slice(4);
            lineNumber++;
            console.log("lineNumber = " + lineNumber);
        }
    }

    return lineNumber;
}

function deleteLineObject(obj, lineId) {
    for (let key in obj) {
        if ((key == "id") && (obj[key] == lineId)) {
            console.log("id = " + key + " lineId = " + lineId);
            delete lines[lineId];
        }
    }
}

function deleteConnection(lineId) {

    console.log("deleteConnectionFunction");
    console.log("lineId = " + lineId);

    // delete data from db
    deleteItem("lines", lineId);

    let line = document.getElementById(lineId);
    line.parentNode.removeChild(line);
}

function defineLineTitleCoordinates(x1, y1, x2, y2, title) {

    // calculate the width of the text above the line

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = "14px Montserrat, sans-serif";

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

function deleteLineTitle(titleId) {
    console.log("deleteLineTitleFunction");
    console.log("titleId = " + titleId);

    let title = document.getElementById(titleId);
    title.parentNode.removeChild(title);
}

// indexedDB

var db;

var openRequest = indexedDB.open("db", 1);

openRequest.onupgradeneeded = function(e) {
    var db = e.target.result;
    console.log("running onupgradeneeded");
    // the database did not previously exist, so create object stores
    db.createObjectStore("elements", {keyPath: "id"});
    db.createObjectStore("lines", {keyPath: "id"});
};

openRequest.onsuccess = function(e) {
    console.log("running onsuccess");
    db = e.target.result;

    // checks if anything is in db
    readItems("elements");
    readItems("lines");
};

openRequest.onerror = function(e) {
    console.log("onerror!");
    console.dir(e);
};

// add item in db

function addItem(elemId, elemTitle, elemImg, elemX, elemY) {
    var transaction = db.transaction(["elements"], "readwrite");
    var elements = transaction.objectStore("elements");
    var item = {
        id: elemId,
        title: elemTitle,
        img: elemImg,
        x: elemX,
        y: elemY,
        created: new Date().getTime()
    };

    var request = elements.add(item);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {
        console.log("the element was added to db successfully");
    };
}

// add line in db

function addLine(lineId, lineTitle, elemId1, elemId2, x1, y1, x2, y2) {
    var transaction = db.transaction(["lines"], "readwrite");
    var lines = transaction.objectStore("lines");
    var item = {
        id: lineId,
        title: lineTitle,
        elem1: elemId1,
        elem2: elemId2,
        x1: parseFloat(x1),
        y1: parseFloat(y1),
        x2: parseFloat(x2),
        y2: parseFloat(y2),
        created: new Date().getTime()
    };

    var request = lines.add(item);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {
        console.log("the line was added to db successfully");
    };
}

// find item in db

function findItem(elemId) {
    var transaction = db.transaction(["elements"], "readonly");
    var elements = transaction.objectStore("elements");
    let request = elements.get(elemId);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    };

    request.onsuccess = function(e) {

        const matching = request.result;

        if (matching !== undefined) {
            // a match was found
            console.log("a match was found");
        }
        else {
            // no match was found
            console.log("no match was found");
        }
    };
}

// edit item's value in db

function editItem(objectStoreName, elemId, elemTitle, elemValue) {
    let transaction = db.transaction([objectStoreName], "readwrite");
    let items = transaction.objectStore(objectStoreName);
    let request = items.get(elemId);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {

        const data = request.result;

        data[elemTitle] = elemValue;

        let requestUpdate = items.put(data);

        requestUpdate.onerror = function(e) {
            // error
            console.log("error while editing data in db");
        }
        
        requestUpdate.onsuccess = function(e) {
            // success
        }
    }
}

// delete item from db

function deleteItem(objectStoreName, elemId) {
    let request = db.transaction([objectStoreName], "readwrite")
                    .objectStore(objectStoreName)
                    .delete(elemId);

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("item was deleted successfully from db");
    }
}

// function to read info from db

function readItems(objectStoreName) {
    // check if there is anything in db
    let request = db.transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
                .openCursor();

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }
            
    request.onsuccess = function(e) {
        const cursor = request.result;
        if (cursor) {
            // store is not empty
            console.log("preparing to load data");

            if (objectStoreName == "elements") {
                console.log("Data for " + cursor.key + " is " + cursor.value.title + " " + cursor.value.x + " " + cursor.value.y);
                newElement(cursor.key, cursor.value.title, cursor.value.img, cursor.value.x, cursor.value.y, "db");
            }
            else if (objectStoreName == "lines") {
                console.log("Data for " + cursor.key + " is " + cursor.value.title + " " + cursor.value.x1 + " " + cursor.value.y1 + cursor.value.x2 + " " + cursor.value.y2);
                createConnection(cursor.key, cursor.value.title, cursor.value.elem1, cursor.value.elem2, cursor.value.x1, cursor.value.y1, cursor.value.x2, cursor.value.y2, "db");
            }
            cursor.continue();
        }
        else {
            // store is empty
            console.log("nothing to restore");
        }
        console.log("data from db was successfully read");
    }
}

clearDbButton = document.getElementById("clear-db");
clearDbButton.addEventListener("click", function() {
    if (window.confirm("Are you sure you want to clear the data? After deletion, the page will be reloaded.")) {
        // delete items from db
        deleteItems("elements");
        deleteItems("lines");
        // reload the page
        document.location.reload();
    }
});

// function to delete all data from db

function deleteItems(objectStoreName) {
    let request = db.transaction([objectStoreName], "readwrite").objectStore(objectStoreName).clear();

    request.onerror = function(e) {
        console.log("error", e.target.error.name);
    }

    request.onsuccess = function(e) {
        console.log("all items were deleted successfully from db");
    }
}