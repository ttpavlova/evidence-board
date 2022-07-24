let importInput = document.getElementById("import-input");

importInput.addEventListener("change", function() {
    importFile(this);
});

function importFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    let result = "";

    reader.onload = function() {
        result = reader.result;
        writeNewData(result);
        // console.log(reader.result);
    }

    reader.onerror = function() {
        result = reader.result;
        // console.log(reader.result);
    }
}

function writeNewData(result) {
    let elementsObjCopy = [];
    
    try {
        let json = JSON.parse(result);
        elementsObjCopy = json;
        console.log(elementsObjCopy);
    } catch {
        alert("Error: Incorrect JSON file");
    }
}

export { importFile };