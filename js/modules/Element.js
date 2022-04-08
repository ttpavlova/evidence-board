import { Item } from './Item.js';

// element class
class Element extends Item {
    constructor(id, title, img, x, y) {
        super();
        
        this.id = id;
        this.title = title;
        this.img = img;
        this.x = x;
        this.y = y;
    }
}

export { Element };