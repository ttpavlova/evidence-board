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

function newElement() {
    // alert("Hi");

    var ok = true;
    var i = 0;

    if (ok === true) {
        // create element
        var div = document.createElement("div");
        // define className
        div.className = "element";
        // define id
        for (i = 0; i < draggableElements.length; i++) {
            i++;
        }
        div.id = "div" + i;

        // define positions
        div.style.left = "50px";
        div.style.top = "50px";

        document.getElementsByTagName('body')[0].appendChild(div);

        // add picture and title

        // create element
        var elem = document.createElement("div");
        // define className
        elem.className = "element__picture";
        // define id
        elem.id = "elem" + i;

        document.getElementById(div.id).appendChild(elem);
    }

    // calling drag function again after creating new div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i);
    }
}