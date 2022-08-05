# Evidence board

Evidence board is a project for creating schemes with connections between elements.

# Demo

You can try the demo at https://evidence-board.netlify.app/

# Features

- creating, editing, deleting items;
- moving items;
- changing a zoom;
- storing the data in the IndexedDB;
- importing and exporting schemes.

# Overview

## Items

There are three types of items: elements, connections and notes. Any element can be connected to another element, elements can have multiple connections.

Elements contain an image and a title and represent an object of investigation. A connection is a line that tells how exactly two elements are connected to each other, what they have in common. And notes have additional information that is explained more detailed.

The board is interactive. You can move elements and notes to any place of the working area. The connections will follow the movable element.

## Selecting an item

To activate buttons for editing and deleting items, you need to select an item by clicking on it. Elements and notes have an "idea" icon at the upper left corner of them when they're selected. Connection change their color from dark brown to blue. There can be only one selected item. To remove the selection, click on the empty area of the background.

## Data storage

The data is stored in IndexedDB. When the page is loaded, information is being read from the db and added to the page. Every operation with items such as creating, updating, deleting or moving affects the data in the db, so it's always up-to-date.

## Saving schemes

Another way to save the data is using importing and exporting functions. "Export a File" button on the upper toolbar allows you to save the current scheme as a JSON file. To open an existing scheme, use Import function. The load may take some time, and the page will be reloaded after everything is uploaded into the db.

# Build

To build and run this project locally, you need to clone this repository and launch a local server.

```
# clone this repository
$ git clone https://github.com/ttpavlova/evidence-board.git
```
