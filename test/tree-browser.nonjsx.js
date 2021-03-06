// TODO: REMOVE THIS GENERATED FILE FROM SOURCE AND USE REACT TOOLS FOR AUTO TRANSFORM
// IIFE to prevent global variable pollution.
var TreeBrowser = (function () {
    "use strict";

    /**
     * Prefixes css class names to allow usage of component in web applications
     * without worry about namespace collision.
     * @param className
     * @returns {string}
     */
    function getCSSPrefix(className) {
        return "react-tree-browser-" + className;
    }

    /**
     * Method that returns false if input is non empty array.
     * @param array
     * @returns {boolean}
     */
    function isEmpty(array) {
        if (Array.isArray(array) && array.length > 0) {
            return false;
        }
        return true;
    }

    /**
     * TreeBrowser Component
     * This component is responsible for defining the interface for
     * the tree component and delegating rendering of nodes to the TreeNode
     */
    var TreeBrowser = React.createClass({displayName: "TreeBrowser",
        getInitialState: function () {
            return this.props.data;
        },
        /**
         * Method to update tree data after render.
         * @param data
         */
        setData: function(data) {
            this.setState({ data: data });
        },
        /**
         * A single click handler that handles all tree node clicks.
         * This method ensures that click target is valid and traverse up the dom to
         * figure out which data point in the component state to toggle collapse.
         * @param event The click event
         */
        _handleClick: function(event) {
            var paths = this.refs.treeRoot.getPathForContainedNode($(event.target));
            if (paths != null) {
                var clickedNode = this._findNodeFromPathArray(paths);
                clickedNode.collapse = !clickedNode.collapse;
                this.forceUpdate();
            }
        },
        /**
         * Finds data for node given it's path, where a path represents a name of a node to traverse.
         * @param paths Array of names
         * @returns {node}
         */
        _findNodeFromPathArray: function(paths) {
            var nodePointer = { children: this.state.data };
            paths.forEach(function(path) {
                // Short circuit as soon as you find node with path as name
                nodePointer.children.some(function(node) {
                    nodePointer = node;
                    return node.name === path;
                });
            });
            return nodePointer;
        },
        render: function () {
            return (
                React.createElement("div", {className: getCSSPrefix("container")},
                    React.createElement("ul", {"data-root": "true", onClick: this._handleClick},
                        React.createElement(TreeNode, {ref: "treeRoot", data: this.state.data})
                    )
                )
            );
        }
    });

    var TreeNode = React.createClass({displayName: "TreeNode",
        /**
         * Responsible applying right classes for styling based on node state (adding icons via css etc).
         * @param node
         * @returns {string}
         */
        getNodeClass: function(node) {
            var classes;
            if (isEmpty(node.children)) {
                classes = getCSSPrefix("leaf");
            } else {
                classes = getCSSPrefix("node");
            }
            return node.collapse ? classes + " " + getCSSPrefix("collapsed") : classes;
        },
        /**
         * Given an element in subtree, returns it's path from the root.
         * @param target
         * @returns {*}
         */
        getPathForContainedNode: function(target) {
            var paths = [];
            if (target.hasClass(getCSSPrefix("node"))) {
                while (target && !target.data("root")) { // while not root node
                    if (isEmpty(paths)) {
                        paths.unshift(target.text());
                    } else {
                        paths.unshift(target.prev().text());
                    }
                    // Traverse additional parent because react is adding an extraneous container.
                    target = target.parent().parent();
                }
                return paths;
            }
            return null;
        },
        render: function () {
            var treeNodes = this.props.data.map(function (node) {
                var nodeFragment = [
                    React.createElement("li", {className: this.getNodeClass(node)},
                        node.name
                    )
                ];
                if (!node.collapse && !isEmpty(node.children)) {
                    nodeFragment.push(
                        React.createElement("ul", null,
                            React.createElement(TreeNode, {data: node.children})
                        )
                    );
                }
                return nodeFragment;
            }, this);
            return (
                React.createElement("div", {className: getCSSPrefix("node-level")},
                treeNodes
                )
            );
        }
    });

    return {
        /**
         * Creates a tree browser component.
         * @param cssSelector Css selector to render item to.
         * @param data Optional initial tree data to render
         * @return {TreeBrowser}
         */
        create: function(cssSelector, data) {
            data = { data: data || [] };
            return React.render(
                React.createElement(TreeBrowser, {data: data}),
                $(cssSelector)[0]
            );
        }
    };

})();

