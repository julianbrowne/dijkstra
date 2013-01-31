describe("ShortestPathUtils", function () {

  beforeEach(function() {

        env = new jasmine.Env();
        env.updateInterval = 0;

        body = document.createElement("body");

        fakeDocument = { body: body, location: { search: "" } };
        trivialReporter = new jasmine.TrivialReporter(fakeDocument);

        nodes = [
            { index: 0, value: 'a', r: 20 },
            { index: 1, value: 'b', r: 20 },
            { index: 2, value: 'c', r: 20 },
            { index: 3, value: 'd', r: 20 },
            { index: 4, value: 'e', r: 20 }
        ];

        paths = [
            { source: 0, target: 1, distance: 150 },
            { source: 0, target: 2, distance: 100 },
            { source: 2, target: 3, distance: 100 },
            { source: 1, target: 3, distance: 40  },
            { source: 3, target: 4, distance: 100 },
            { source: 1, target: 4, distance: 100 }
        ];

        fakeElementId = "fake-element";

    });

    it("should exist", function() {
        expect(SpUtils).toBeDefined();
    });

    it("should find valid route", function() {
        expect(SpUtils.findRoute(nodes, paths)).toEqual({mesg:"OK", path:[0, 1, 4], distance:250});
    });

    it("should clear div contents", function() {
        var div=document.createElement('div');
        div.setAttribute('id','fake-div');
        div.appendChild(document.createElement('p'));
        document.body.appendChild(div);
        var fakeElement = document.getElementById('fake-div')

        expect(fakeElement.innerHTML).toContain("<p></p>");
        SpUtils.clearDiv('fake-div');
        expect(fakeElement.innerHTML).not.toContain("<p></p>");
    });

    it("should make appropriate input field", function() {
        expect(SpUtils.makeTextInput('a','b').getAttribute("name")).toEqual("a:b");
    });

    it("should make appropriate submit button", function() {
        expect(SpUtils.makeSubmitInput('a').getAttribute("value")).toEqual("a");
        expect(SpUtils.makeSubmitInput('a').getAttribute("type")).toEqual("submit");
        expect(SpUtils.makeSubmitInput('a').getAttribute("onclick")).toMatch(/callDrawGraph/);
    });

    it("should add element properties", function() {
        var div = document.createElement('div');
        expect(SpUtils.addElementProperty(div,'class','abc').getAttribute("class")).toEqual("abc");
        expect(SpUtils.addElementProperty(div,'other','123').getAttribute("other")).toEqual("123");
    });

    it("should sort unique nodes from distances", function() {
        var distances = [0,1,1,2,2,3,3,4,4,5];
        expect(SpUtils.sortUniqueNodesFromDistances(distances).length).toEqual(6);
    });

    it("should make suitable clean array for populating", function() {
        var nodes = [ 1 ];
        expect(SpUtils.makeDistanceArrayFromNodes(nodes)).toEqual([['x']]);
        var nodes = [ 1,2,3,4 ];
        expect(SpUtils.makeDistanceArrayFromNodes(nodes)).toEqual([['x','x','x','x'],['x','x','x','x'],['x','x','x','x'],['x','x','x','x']]);
    });

    it("should make suitable array for use in dijkstra algorithm", function() {
        var nodes = [ ['x','x'],['x','x'] ];
        var paths = [ {source:0, target:1, distance: 100} ];
        expect(SpUtils.populateDistances(nodes, paths)).toEqual([['x',100],[100,'x']]);
    });

});
