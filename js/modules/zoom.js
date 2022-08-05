let main = document.getElementById("main");
let container = document.getElementById("container");
let zoomPercent = document.getElementById("zoom-percent");

function zoom(name) {

    let scale = Number(getZoomValue());
    
    // 1.0 is default value
    if (name == 'in') {
        // if zoom is not max yet
        if (scale < 1) {
            scale = (scale + 0.1).toFixed(1);
        }
    }
    else if (name == 'out') {
        if (scale > 0.6) {
            scale = (scale - 0.1).toFixed(1);
        }
    }

    container.style.transform = "scale(" + scale + ")";
    changeMainHeight();

    zoomPercent.innerHTML = getZoomInPercent(scale) + "%";

    localStorage.setItem("zoom", scale);
}

function setZoomValue() {

    let scale = getZoomValue();

    container.style.transform = "scale(" + scale + ")";

    zoomPercent.innerHTML = getZoomInPercent(scale) + "%";
}

function getZoomValue() {

    let scale = "";

    if (isNaN(localStorage.getItem("zoom")) || (localStorage.getItem("zoom") == null)) {
        localStorage.setItem("zoom", 1);
        scale = 1;
    }
    else {
        scale = localStorage.getItem("zoom");
    }

    return scale;
}

function getZoomInPercent(scale) {
    return scale * 100;
}

function changeMainHeight() {
    let containerParameters = container.getBoundingClientRect();
    let containerHeight = containerParameters.height;
    main.style.height = containerHeight + "px";
}

export { zoom, setZoomValue, changeMainHeight };