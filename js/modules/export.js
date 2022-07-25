import { items } from '../main.js';

let exportBtn = document.getElementById("export");

exportBtn.addEventListener("click", function() {
    exportFile();
});

function exportFile() {
    let json = JSON.stringify(items);
    let blob = new Blob([json], {type: 'text/plain'});
    exportBtn.href = URL.createObjectURL(blob);
}

export { exportFile };