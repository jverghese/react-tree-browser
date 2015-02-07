describe("TreeBrowser component", function() {

  // These are functions so a copy of the data is always created.
  function getOnlyLeavesJson() {
    return [
      {"name": "sites", "collapse": false, "children": []},
      {"name": "includes", "collapse": false, "children": []}
    ];
  }

  function getTreeJson() {
    return [
      {"name": "sites", "collapse": false, "children": [
        {name: "site1", "collapse": false, children: [] },
        {name: "site2", "collapse": false, children: [] }
      ]},
      {"name": "includes", "collapse": false, "children": []}
    ];
  }

  // Setup up fixtures for testing
  beforeEach(function() {
    $('body').append('<div class="test-fixture1"></div><div class="test-fixture2"></div>');
  })

  afterEach(function() {
    $(".test-fixture1, .test-fixture2").remove()
  })

  describe('creation api', function() {

    it("has create method", function() {
      expect(typeof TreeBrowser.create).toBe("function");
    });

    it("does not return same instance when called again", function() {
      var tree1 = TreeBrowser.create(".test-fixture1");
      var tree2 = TreeBrowser.create(".test-fixture2");
      expect(tree1).toBeDefined();
      expect(tree2).toBeDefined();
      expect(tree1).not.toBe(tree2)
    });

    describe('with no data', function() {

      var tree;

      beforeEach(function() {
        tree = TreeBrowser.create(".test-fixture1");
      })

      it("renders container", function() {
        // Has container element
        expect($(".test-fixture1").find(".react-tree-browser-container")[0]).toBeDefined();
      });

      it("renders root", function() {
        expect($(".test-fixture1").find("[data-root='true']")[0]).toBeDefined();
      });

      it("does not render nodes or leaves", function() {
        expect($(".test-fixture1").find(".react-tree-browser-node")[0]).not.toBeDefined();
        expect($(".test-fixture1").find(".react-tree-browser-leaf")[0]).not.toBeDefined();
      });

    });

    describe('with data', function() {

      var tree;

      beforeEach(function() {
        tree = TreeBrowser.create(".test-fixture1", getOnlyLeavesJson());
      });

      it("renders container", function() {
        var tree1 = TreeBrowser.create(".test-fixture1");
        // Has container element
        expect($(".test-fixture1").find(".react-tree-browser-container")[0]).toBeDefined();
      });

      it("renders root", function() {
        expect($(".test-fixture1").find("[data-root='true']")[0]).toBeDefined();
      });

      it("does not render nodes", function() {
        expect($(".test-fixture1").find(".react-tree-browser-node")[0]).not.toBeDefined();
      });

      it("renders 2 leaves with respsective names", function() {
        var leaves = $(".test-fixture1").find(".react-tree-browser-leaf");
        expect(leaves.length).toBe(2);
        expect($(leaves[0]).text()).toBe("sites");
        expect($(leaves[1]).text()).toBe("includes");
      })

    });

  });

  describe('instance api', function() {

    var treeInstance, treeInstance2;

    beforeEach(function() {
      treeInstance = TreeBrowser.create(".test-fixture1", getOnlyLeavesJson());
      treeInstance2 = TreeBrowser.create(".test-fixture2", getTreeJson());
    })

    it("exposes setData method", function() {
      expect(typeof treeInstance.setData).toBe("function");
    });

    describe("setData", function() {

      it("removes all nodes and leaves when updated with empty array", function() {
        // No nodes are rendered
        expect($(".test-fixture1").find(".react-tree-browser-node").length).toBe(0);
        // Two leaves are rendered
        expect($(".test-fixture1").find(".react-tree-browser-leaf").length).toBe(2);

        // Setting to empty array
        treeInstance.setData([]);

        // Expect no leaves to be rendered
        expect($(".test-fixture1").find(".react-tree-browser-leaf").length).toBe(0)
      });

      it("adds two leaves", function() {
        // Two leaves are rendered
        expect($(".test-fixture1").find(".react-tree-browser-leaf").length).toBe(2);

        var newData = getOnlyLeavesJson();
        newData.push({ name: "Site1000", children: []});
        newData.push({ name: "Site2000", children: []});
        // Setting to empty array
        treeInstance.setData(newData);

        // Expect no leaves to be rendered
        var leaves = $(".test-fixture1").find(".react-tree-browser-leaf");
        expect(leaves.length).toBe(4);
        expect($(leaves[2]).text()).toBe("Site1000");
        expect($(leaves[3]).text()).toBe("Site2000");
      });

      it("renders both nodes and leaves", function() {
        expect($(".test-fixture2").find(".react-tree-browser-node").length).toBe(1);
        // Two leaves are rendered
        expect($(".test-fixture2").find(".react-tree-browser-leaf").length).toBe(3);
      });

    });


  });

  describe('interactivity', function() {

    var treeData, treeInstance;

    beforeEach(function() {
      treeData = getTreeJson();
      treeInstance = TreeBrowser.create(".test-fixture1", treeData);
    });

    it("clicking on item that's not collapsed will collapse it", function() {
      // Has no collapsed items
      expect($(".test-fixture1").find(".react-tree-browser-collapsed").length).toBe(0);
      $('.test-fixture1').find("li:contains('sites')").trigger("click");
      // Now has a collapsed root
      expect($(".test-fixture1").find(".react-tree-browser-collapsed").length).toBe(1);
    });

    it("clicking on item add/remove node items", function() {
      // Items are shown
      expect($('.test-fixture1').find("li:contains('site1')").length).toBe(1);
      expect($('.test-fixture1').find("li:contains('site2')").length).toBe(1);
      // Trigger click on parent item
      $('.test-fixture1').find("li:contains('sites')").trigger("click");

      // Items are now removed
      expect($('.test-fixture1').find("li:contains('site1')").length).toBe(0);
      expect($('.test-fixture1').find("li:contains('site2')").length).toBe(0);
    });

    it("clicking on item will also mutate data's collapse field", function() {
      expect(treeData[0].collapse).toBe(false);
      $('.test-fixture1').find("li:contains('sites')").trigger("click");
      expect(treeData[0].collapse).toBe(true);
      $('.test-fixture1').find("li:contains('sites')").trigger("click");
      expect(treeData[0].collapse).toBe(false);
    });

  });



});