class itemType {
    constructor() {
        this.number = 0; // number of items
        this.numArr = []; // array of numbers corresponding to items' ids
        this.maxNumId = 0; // max number in numArr[]
    }

    // get id of the latest created item
    getLatestItemId() {
        return this.maxNumId;
    }

    // count id of the latest created item
    countLatestItemId() {
        if (this.numArr.length > 0) {
            this.maxNumId = Math.max.apply(null, this.numArr);
        }
    }

    // update array of ids when new item is created
    addIdToArray(id) {
        this.numArr.push(id.toString());
        // update max id
        this.countLatestItemId();
    }

    // remove id from array when item is deleted
    removeIdFromArray(id) {
        let index = this.numArr.indexOf(id);

        if (index > -1) {
            this.numArr.splice(index, 1);
        }

        // update max id
        this.countLatestItemId();
    }
}

export { itemType };