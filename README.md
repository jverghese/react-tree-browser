# React Tree Browser

My first react project. A simple tree browser.

[Demo Page](http://jverghese.github.io/react-tree-browser) | [Test Page](http://jverghese.github.io/react-tree-browser/test.html)

Source File: https://github.com/jverghese/react-tree-browser/blob/master/src/tree-browser.js  
Test File: https://github.com/jverghese/react-tree-browser/blob/master/test/test.js

## Tree data schema
Array of nodes, where each node has a name, collapse boolean and children with references to other nodes.
```json
[
  {
    "name": "sites",
    "collapse": false,
    "children": [
      {"name": "site1", "collapse": false, "children": []}
    ]
  },
  {
    "name": "includes",
    "collapse": false,
    "children": []
  }
]
```

## API
```js
  var treeInstance = TreeBrowser.create(sel, data); // Here sel is a valid css selector and data is optional.
  treeInstance.setData(data); // Casts updates to the tree.
```

## Setup

- bower install
- open index.html on a server (makes ajax calls to retrieve tree data json)

## Optimizations:
- Component only attaches a *single* click handler to every instance of the tree browser to reduce operational overhead (especially with large number of nodes).
