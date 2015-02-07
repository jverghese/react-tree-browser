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
    var TreeBrowser = React.createClass({
        getInitialState: function () {
            return { data: [] };
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
        _handleTreeNodeClick: function(event) {
            var target = $(event.target),
                paths = [];
            // If target is a tree node that's not a leaf, then perform collapse/expand.
            if (target.hasClass(getCSSPrefix("node"))) {
                while(target && !target.data("root")) { // while not root node
                    if (isEmpty(paths)) {
                        paths.unshift(target.text());
                    } else {
                        paths.unshift(target.prev().text());
                    }
                    // Traverse additional parent because react is adding an extraneous container.
                    target = target.parent().parent();
                }
                var clickedNode = this._findNodeFromPathArray(paths);
                clickedNode.collapse = !clickedNode.collapse;
                // Note: Perhaps react has a more concise of saying update with current state.
                this.setState(this.state)
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
                <div className={getCSSPrefix("container")}>
                    <ul data-root="true" onClick={this._handleTreeNodeClick}>
                        <TreeNode data={this.state.data} />
                    </ul>
                </div>
            );
        }
    });

    var TreeNode = React.createClass({
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
        render: function () {
            var treeNodes = this.props.data.map(function (node) {
                var nodeFragment = [
                    <li className={this.getNodeClass(node)}>
                        {node.name}
                    </li>
                ];
                if (!node.collapse && !isEmpty(node.children)) {
                    nodeFragment.push(
                        <ul>
                            <TreeNode data={node.children} />
                        </ul>
                    );
                }
                return nodeFragment;
            }, this);
            return (
                <div className={getCSSPrefix("node-level")}>
                {treeNodes}
                </div>
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
            data = data || {};
            return React.render(
                <TreeBrowser data={data} />,
                $(cssSelector)[0]
            );
        }
    };

})();