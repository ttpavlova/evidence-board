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

        var line1 = document.getElementById("line1");
        var line2 = document.getElementById("line2");
        
        if (i == 0) {
            line1.setAttribute("x1", e.clientX);
            line1.setAttribute("y1", e.clientY);
        }
        else if (i == 1) {
            line1.setAttribute("x2", e.clientX);
            line1.setAttribute("y2", e.clientY);
            line2.setAttribute("x1", e.clientX);
            line2.setAttribute("y1", e.clientY);
        }
        else {
            line2.setAttribute("x2", e.clientX);
            line2.setAttribute("y2", e.clientY);
        }
        
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// new element

let i = 0;

let newItem = document.getElementById("new-element");

let modalWindow = document.getElementById("modal-element");
let modalWindowConnection = document.getElementById("modal-connection");

//let closeBtn = document.getElementById("close-btn");
let closeBtn = document.querySelector("modal__close");

let inputValue = document.getElementById("modal-input").value;

let submitBtn = document.getElementById("modal-submit");

let messageInput = document.getElementById("message-input");

submitBtn.disabled = true;

function fillSelect() {
    let elements = document.getElementsByClassName("element__title");

    let selectFirstElement = document.getElementById("modal-elem1");
    let selectSecondElement = document.getElementById("modal-elem2");

    for (let i = 0; i < elements.length; i++) {
        let option = elements[i].innerHTML;
        let elem = document.createElement("option");
        elem.textContent = option;
        elem.value = option;
        let elem2 = document.createElement("option");
        elem2.textContent = option;
        elem2.value = option;
        // cloneNode ?
        selectFirstElement.appendChild(elem);
        selectSecondElement.appendChild(elem2);
    }
}

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

function openModal(elem) {

    fillSelect();

    // посчитаем количество имеющихся на странице элементов

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

// modal

function closeModal(elem) {

    if (elem === 'elem') {
        modalWindow.classList.remove("modal__open");
    }
    else {
        modalWindowConnection.classList.remove("modal__open");
    }

    clearSelect();
}

function Submit() {

    inputValue = document.getElementById("modal-input").value;

    console.log("submit" + inputValue);

    function check() {

        let ifTitleExists = 0;

        for (let i = 0; i < draggableElements.length; i++) {
            if (document.getElementsByClassName("element__title")[i].innerHTML === inputValue) {
                // если нашли совпадение, предлагаем ввести другое название
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
                num = i+2;
            }
            console.log("i после подсчёта elements = " + num);

            // define className
            div.className = "element";

            // define id
            div.id = "div" + num;

            // define positions
            div.style.left = "50px";
            div.style.top = "50px";

            // put new div to container class
            document.getElementsByClassName('container')[0].appendChild(div);

            // add image and title

            var elem = document.createElement("div");
            elem.className = "element__picture";
            elem.id = "elem" + num;

            document.getElementById(div.id).appendChild(elem);

            // add element's image

            var img = document.createElement("img");
            img.className = "element__img";
            img.src = localStorage.getItem("imgData" + i);
            img.alt = "image";
            document.getElementById(elem.id).appendChild(img);

            // add element's title

            var elem_title = document.createElement("div");
            elem_title.className = "element__title";
            elem_title.innerHTML = "void_value";

            elem_title.innerHTML = inputValue;

            document.getElementById(div.id).appendChild(elem_title);

            console.log(num);

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

// new connection

// function newConnection() {
//     var elem1 = prompt("Enter the title of the first element: ");
//     var elem2 = prompt("Enter the title of the second element: ");
//     var connection_title = prompt("Enter the title of new connection");

//     for (let i = 0; i < draggableElements.length; i++) {
//         //console.log(document.getElementsByClassName("element__title")[i].innerHTML);
//         if (document.getElementsByClassName("element__title")[i].innerHTML === elem1) {
//             //alert("Element found!");

//             // insert if-else if taken!!!


//         }
//     }
// }