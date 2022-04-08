import { Item } from './Item.js';

// note class
class Note extends Item {
    constructor(id, title, text, x, y) {
        super();
        
        this.id = id;
        this.title = title;
        this.text = text;
        this.x = x;
        this.y = y;
    }
}

export { Note };