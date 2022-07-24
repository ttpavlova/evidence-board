import { model, elements, lines, notes } from '../main.js';

let exportBtn = document.getElementById("export");

function exportFile() {
    let elements = (model.elements);
    let json = JSON.stringify(elements);
    let blob = new Blob([json], {type: 'text/plain'});
    exportBtn.href = URL.createObjectURL(blob);
}

export { exportFile };