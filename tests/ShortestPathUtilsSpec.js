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
        expect(ShortestPathUtils).toBeDefined();
    });

    it("should clear div contents", function() {
        var div=document.createElement('div');
        div.setAttribute('id','fake-div');
        div.appendChild(document.createElement('p'));
        document.body.appendChild(div);
        var fakeElement = document.getElementById('fake-div')

        expect(fakeElement.innerHTML).toContain("<p></p>");
        ShortestPathUtils.clearDiv('fake-div');
        expect(fakeElement.innerHTML).not.toContain("<p></p>");
    });

    it("should make appropriate input field", function() {
        expect(ShortestPathUtils.makeTextInput('a','b').getAttribute("name")).toEqual("a:b");
    });

    it("should make appropriate submit button", function() {
        expect(ShortestPathUtils.makeSubmitInput('a').getAttribute("value")).toEqual("a");
        expect(ShortestPathUtils.makeSubmitInput('a').getAttribute("type")).toEqual("submit");
        expect(ShortestPathUtils.makeSubmitInput('a').getAttribute("onclick")).toMatch(/callDrawGraph/);
    });

    it("should add element properties", function() {
        var div = document.createElement('div');
        expect(ShortestPathUtils.addElementProperty(div,'class','abc').getAttribute("class")).toEqual("abc");
        expect(ShortestPathUtils.addElementProperty(div,'other','123').getAttribute("other")).toEqual("123");
    });

    it("should sort unique nodes from distances", function() {
        var distances = [0,1,1,2,2,3,3,4,4,5];
        expect(ShortestPathUtils.sortUniqueNodesFromDistances(distances).length).toEqual(6);
    });

    it("should return -1 when clearing a non-existent element", function() {
        expect(ShortestPathUtils.clearDiv('does-not-exist')).toEqual(-1);
    });

    it("should give the text input the spdist class", function() {
        expect(ShortestPathUtils.makeTextInput('a','b').getAttribute("class")).toEqual("spdist");
    });

    it("should give the text input an id matching its name", function() {
        var input = ShortestPathUtils.makeTextInput('a','b');
        expect(input.getAttribute("id")).toEqual(input.getAttribute("name"));
    });

    it("should make text input of type text", function() {
        expect(ShortestPathUtils.makeTextInput('a','b').getAttribute("type")).toEqual("text");
    });

    it("should make a select element with the correct id", function() {
        var select = ShortestPathUtils.makeDropDown("source", 3);
        expect(select.tagName.toLowerCase()).toEqual("select");
        expect(select.getAttribute("id")).toEqual("source");
    });

    it("should make a dropdown with the correct number of options", function() {
        var select = ShortestPathUtils.makeDropDown("source", 4);
        expect(select.options.length).toEqual(4);
    });

    it("should populate dropdown options with node names in order", function() {
        var select = ShortestPathUtils.makeDropDown("source", 3);
        expect(select.options[0].innerHTML).toEqual("a");
        expect(select.options[1].innerHTML).toEqual("b");
        expect(select.options[2].innerHTML).toEqual("c");
    });

    it("should return nodes with correct index and value properties", function() {
        var result = ShortestPathUtils.sortUniqueNodesFromDistances([0, 1, 1, 2]);
        expect(result[0].index).toEqual(0);
        expect(result[0].value).toEqual('a');
        expect(result[2].index).toEqual(2);
        expect(result[2].value).toEqual('c');
    });

    it("should return a single node when all distance values are identical", function() {
        var result = ShortestPathUtils.sortUniqueNodesFromDistances([2, 2, 2, 2]);
        expect(result.length).toEqual(1);
        expect(result[0].index).toEqual(2);
        expect(result[0].value).toEqual('c');
    });

});
