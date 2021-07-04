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
        img.src = "img/6_Saussurea_alpina.jpg";
        img.alt = "image";
        document.getElementById(elem.id).appendChild(img);

        // add element's title

        var elem_title = document.createElement("div");
        elem_title.className = "element__title";
        elem_title.innerHTML = "void_value";
        var elem_title_by_user = prompt("Enter element title: "); 

        // checks if title is already taken
        function check() {
            for (let i = 0; i < draggableElements.length-1; i++) {
                if (document.getElementsByClassName("element__title")[i].innerHTML === elem_title_by_user) {
                    elem_title_by_user = prompt("This title is already taken. Enter another element title: ");
                    check();
                }
                else {
                    elem_title.innerHTML = elem_title_by_user;
                }
            }
        }

        check();
    
        document.getElementById(div.id).appendChild(elem_title);

        console.log(num);
    //}

    // calling drag function again after creating new div
    for (let i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i], i);
    }
}

// new connection

function newConnection() {
    var elem1 = prompt("Enter the title of the first element: ");
    var elem2 = prompt("Enter the title of the second element: ");
    var connection_title = prompt("Enter the title of new connection");

    for (let i = 0; i < draggableElements.length; i++) {
        //console.log(document.getElementsByClassName("element__title")[i].innerHTML);
        if (document.getElementsByClassName("element__title")[i].innerHTML === elem1) {
            //alert("Element found!");

            // insert if-else if taken!!!


        }
    }
}

function newElement1() {
    // сначала посчитаем количество имеющихся на странице элементов

    var num = 0;

    for (i = 0; i < draggableElements.length; i++) {
        num = i + 2;
    }
    
    console.log(num);

    // спросим у пользователя имя нового элемента при нажатии на пноку "новый элемент"

    var new_elem_title = prompt("Enter element title: ");

    function check() {
        for (let i = 0; i < draggableElements.length; i++) {
            if (document.getElementsByClassName("element__title")[i].innerHTML === new_elem_title) {
                // если нашли совпадение, предлагаем ввести другое название
                new_elem_title = prompt("This title has already been taken. Choose another one: ");
                //check();
            }
            else {
                //alert("aleeert!");
                // если повторений нет, создаём новый элемент

                // создаём главный блок

                var div = document.createElement("div");
                div.id = "div" + num;
                div.className = "element";
                div.style.left = "350px";
                div.style.top = "350px";
                document.getElementsByClassName("container")[0].appendChild(div);

                // создаём блок, в котором хранится тег с изображением
                var elem = document.createElement("div");
                elem.id = "elem" + num;
                elem.className = "element__picture";
                document.getElementById(div.id).appendChild(elem);

                // добавляем изображение
                var img = document.createElement("img");
                img.className = "element__img";
                img.src = "img/6_Saussurea_alpina.jpg";
                img.alt = "image";
                document.getElementById(elem.id).appendChild(img);

                // добавляем блок с названием
                var title = document.createElement("div");
                title.className = "element__title";
                title.innerHTML = new_elem_title;
                document.getElementById(div.id).appendChild(title);

                console.log(num);

                // calling drag function again after creating new div
                for (let i = 0; i < draggableElements.length; i++) {
                    dragElement(draggableElements[i], i);
                }
            }
        }
        
    }
    check();
}