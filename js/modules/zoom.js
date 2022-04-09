let container = document.getElementById("container");

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

    localStorage.setItem("zoom", scale);
}

function setZoomValue() {

    let scale = getZoomValue();

    container.style.transform = "scale(" + scale + ")";
}

function getZoomValue() {

    let scale = "";

    if (isNaN(localStorage.getItem("zoom")) || (localStorage.getItem("zoom") == null)) {
        scale = localStorage.setItem("zoom", 1);
    }
    else {
        scale = localStorage.getItem("zoom");
    }

    return scale;
}

export { zoom, setZoomValue };