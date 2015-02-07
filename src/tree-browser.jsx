// IIFE to prevent global variable pollution.
(function () {
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
            return {data: []};
        },
        loadData: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState({data: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        /**
         * A single click handler that handles all tree node clicks.
         * This method ensures that click target is valid and traverse up the dom to
         * figure out which data point in the component state to toggle collapse.
         * @param event The click event
         */
        handleTreeNodeClick: function(event) {
            var target = $(event.target),
                paths = [];
            // If target is a tree node that's not a leaf, then perform collapse/expand.
            if (target.hasClass(getCSSPrefix("node")) && !target.data("leaf")) {
                while(target && !target.data("root")) { // while not root node
                    if (isEmpty(paths)) {
                        paths.unshift(target.text());
                    } else {
                        paths.unshift(target.prev().text());
                    }
                    // Traverse additional parent because react is adding an extraneous container.
                    target = target.parent().parent();
                }
                var clickedNode = this.findNodeFromPathArray(paths);
                clickedNode.collapse = !clickedNode.collapse;
                // Note: Perhaps react has a more concise of saying update with current state.
                this.setState(this.state)
            }
        },
        findNodeFromPathArray: function(paths) {
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
        componentDidMount: function () {
            this.loadData();
        },
        render: function () {
            return (
                <div className={getCSSPrefix("container")}>
                    <ul data-root="true" onClick={this.handleTreeNodeClick}>
                        <TreeNode data={this.state.data} />
                    </ul>
                </div>
            );
        }
    });

    var TreeNode = React.createClass({
        render: function () {
            var treeNodes = this.props.data.map(function (node) {
                var nodeFragment = [
                    <li className={getCSSPrefix("node")} data-collapsed={node.collapse} data-leaf={isEmpty(node.children)}>
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
            });
            return (
                <div className={getCSSPrefix("node-level")}>
                {treeNodes}
                </div>
            );
        }
    });

    React.render(
        <TreeBrowser url="sample-data/tree.json" />,
        document.getElementById('treeContainer')
    );
})();
