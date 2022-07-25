import { model, elements, lines, notes, items } from '../main.js';

let exportBtn = document.getElementById("export");

function exportFile() {
    // let elements = (model.elements);
    // let items = items;
    // let json = JSON.stringify(elements);
    let json = JSON.stringify(items);
    let blob = new Blob([json], {type: 'text/plain'});
    exportBtn.href = URL.createObjectURL(blob);
}

export { exportFile };