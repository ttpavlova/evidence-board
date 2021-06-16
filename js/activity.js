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

var i = 0;

function newElement() {

    var ok = true;
    

    //if (ok === true) {
        // create element
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

        // add picture and title

        // create element
        var elem = document.createElement("div");
        // define className
        elem.className = "element__picture";
        // define id
        elem.id = "elem" + num;

        //elem.src = "img/3_Nelumbo_nucifera.jfif";
        //document.getElementById(div.id).src = "img/3_Nelumbo_nucifera.jfif";

       document.getElementById(div.id).appendChild(elem);

        console.log(num);
    //}

    // calling drag function again after creating new div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i);
    }
}