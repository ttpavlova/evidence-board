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

let messageInput = document.getElementById("message-input");

let divNumber = 0;
let lineNumber = 0;

let ifOpenedFirst = true;

submitBtn.disabled = true;

// find latest div's id and line's id

findLatestDivId();
findLatestLineID();

// fills both dropdown lists with options

function fillSelect() {
    let elements = document.getElementsByClassName("element__title");

    let selectFirstElement = document.getElementById("modal-elem1");
    let selectSecondElement = document.getElementById("modal-elem2");

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
        for (i = 1; i < elems.length; i++) {
            selectFirstElement[i].disabled = false;
            if (selectSecondElement.selectedIndex == i) {
                selectFirstElement[i].disabled = true;
            }            
        } 
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

function createConnection() {

    inputValueConnection = document.getElementById("modal-connection-title").value;

    let divId1 = "";
    let divId2 = "";
    let title1 = "";
    let title2 = "";

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

    let x1, y1, x2, y2 = 0;

    let styleFirstElement = window.getComputedStyle(document.getElementById(divId1));
    x1 = parseFloat(styleFirstElement.getPropertyValue("left")) + 100;
    y1 = parseFloat(styleFirstElement.getPropertyValue("top")) + 100;
    console.log("x1 = " + x1 + " y1 = " + y1);

    let styleSecondElement = window.getComputedStyle(document.getElementById(divId2));
    x2 = parseFloat(styleSecondElement.getPropertyValue("left")) + 100;
    y2 = parseFloat(styleSecondElement.getPropertyValue("top")) + 100;
    console.log("x2 = " + x2 + " y2 = " + y2);

    let line = document.createElementNS('http://www.w3.org/2000/svg','line');

    linesNum = findLatestLineID();

    line.id = "line" + linesNum;

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");

    findConnectedDivs(line.id, inputValueConnection, divId1, divId2);

    document.getElementsByTagName('svg')[0].appendChild(line);
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
            console.log("lines.line" + i + "." + key + " = " + (lines["line" + i])[key]);
            if ((lines["line" + i])[key] == draggableElementId) {
                console.log("key = " + key);
                console.log("lineId = line" + i);
                if (action == 'move') {
                    moveLines("line" + i, elem, key);
                }
                else if (action == 'delete') {
                    deleteLineObject(lines["line" + i], "line" + i);
                    deleteConnection("line" + i);
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
    let linesNum = linesAll.length + 1;

    // console.log("lineId = " + lineId);

    for (let i = 0; i < linesAll.length; i++) {
        if ((linesAll[i].id == lineId) && (key == "elemId1")) {
            linesAll[i].setAttribute("x1", parseFloat(elem.style.left) + 100);
            linesAll[i].setAttribute("y1", parseFloat(elem.style.top) + 100);
        }
        else if ((linesAll[i].id == lineId) && (key == "elemId2")) {
            linesAll[i].setAttribute("x2", parseFloat(elem.style.left) + 100);
            linesAll[i].setAttribute("y2", parseFloat(elem.style.top) + 100);
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

function Submit() {

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
            
            divNumber = findLatestDivId();
            ifOpenedFirst = false;

            // define className
            div.className = "element";

            // define id
            div.id = "div" + divNumber;

            // define positions
            if (num > 0) {
                div.style.left = 50 + (num-1)*200 + (num-1)*100 + "px";
            }
            else {
                div.style.left = 50 + num*200 + num*100 + "px";
            }
            // div.style.left = "50px";
            div.style.top = "50px";

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
            img.src = localStorage.getItem("imgData" + i);
            img.alt = "image";
            document.getElementById(elem.id).appendChild(img);

            // add delete button

            var span = document.createElement("span");
            span.className = "element__delete";
            span.onclick = function onclick(event) {deleteElement(div.id)};
            span.innerHTML = "&times;";
            document.getElementById(elem.id).appendChild(span);

            // add element's title

            var elem_title = document.createElement("div");
            elem_title.className = "element__title";
            elem_title.innerHTML = "void_value";

            elem_title.innerHTML = inputValue;

            document.getElementById(div.id).appendChild(elem_title);

            console.log(divNumber);

            // clear input and close modal window if new element is created

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
    }
    check();
}

// checks if input is empty

function checkIfInputIsEmpty() {
    inputValue = document.getElementById("modal-input").value;
    let regex = /^[^\s]+[A-Za-z\d\s]+[^\s]$/;

    console.log("in check " + inputValue);

    if (regex.test(inputValue)) {
        messageInput.innerHTML = "Input accepted";
        submitBtn.disabled = false;
        return true;
    }
    else {
        messageInput.innerHTML = "Field must contain at least one symbol and cannot start or end with whitespace.";
        submitBtn.disabled = true;
    }
}

// adds a file preview and loads the image in local storage in base64 encoding

function previewFile() {

    let preview = document.getElementById("modal-load-img");
    let file = document.getElementById("modal-load-file").files[0];
    let reader = new FileReader();
  
    reader.onloadend = function () {
      preview.src = reader.result;
      console.log('Result ', reader.result);
      let imgData = reader.result;
      localStorage.setItem("imgData" + i, imgData);
      i++;
    }
  
    if (file) {
      reader.readAsDataURL(file);
      
    } else {
      preview.src = "";
    }
}

//localStorage.clear();

// find latest div's id

function findLatestDivId() {
    if (ifOpenedFirst == true) {
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
    else {
        divNumber++;
        console.log("divNumber = " + divNumber);
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

    ifOpenedFirst = false;

    // calling drag function again after deleting a div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i);
    }
}

// find latest line's id 

function findLatestLineID() {
    let linesAll = document.getElementsByTagName("line");
    let svg = document.getElementById("svg");

    if (ifOpenedFirst == true) {  
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
    else {
        lineNumber++;
        console.log("lineNumber = " + lineNumber);
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

    let line = document.getElementById(lineId);
    line.parentNode.removeChild(line);
}