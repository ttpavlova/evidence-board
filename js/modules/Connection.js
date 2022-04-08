import { Item } from './Item.js';

// connection class
class Connection extends Item {
    constructor(id, title, elemId1, elemId2, x1, y1, x2, y2) {
        super();
        
        this.id = id;
        this.title = title;
        this.elemId1 = elemId1;
        this.elemId2 = elemId2;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

export { Connection };