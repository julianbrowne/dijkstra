
describe("ShortestPath Calculator", function () {

  beforeEach(function() {

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

        sp = new ShortestPathCalculator(nodes, paths);

    });

    it("library should be present", function() {
        expect(ShortestPathCalculator).toBeDefined();
    });

    it("test instance should be there", function() {
        expect(sp).toBeDefined();
    });

    it("should find valid route", function() {
        var sp = new ShortestPathCalculator(nodes, paths);
        route = sp.findRoute(0,4);
        expect(route.mesg).toEqual("OK");
    });

    it("should detect valid integers", function() {
        expect(ShortestPathCalculator.isInteger(1)).toBeTruthy();
        expect(ShortestPathCalculator.isInteger(0)).toBeTruthy();
        expect(ShortestPathCalculator.isInteger(99)).toBeTruthy();
        expect(ShortestPathCalculator.isInteger('a')).toBeFalsy();
        expect(ShortestPathCalculator.isInteger(-1)).toBeFalsy();
    });

    ShortestPathCalculator.isInteger = function(i) {
    return /^\d+$/.test(i);
}

    it("should make suitable clean array for populating", function() {
        var nodes = [ 1,2,3,4 ];
        var sp = new ShortestPathCalculator(nodes, paths);
        sp.makeDistanceArrayFromNodes();
        expect(sp.distances).toEqual([['x','x','x','x'],['x','x','x','x'],['x','x','x','x'],['x','x','x','x']]);
    });

    it("should throw when fewer than 3 nodes are provided", function() {
        var tooFewNodes = [
            { index: 0, value: 'a', r: 20 },
            { index: 1, value: 'b', r: 20 }
        ];
        expect(function() {
            new ShortestPathCalculator(tooFewNodes, paths);
        }).toThrow();
    });

    it("should throw when more than 20 nodes are provided", function() {
        var tooManyNodes = [];
        for (var i = 0; i < 21; i++) tooManyNodes.push({ index: i, value: 'x', r: 20 });
        expect(function() {
            new ShortestPathCalculator(tooManyNodes, paths);
        }).toThrow();
    });

    it("should throw when a non-integer source is passed to findRoute", function() {
        expect(function() { sp.findRoute('a', 4); }).toThrow();
    });

    it("should throw when a non-integer target is passed to findRoute", function() {
        expect(function() { sp.findRoute(0, 'z'); }).toThrow();
    });

    it("should throw when target index is out of range", function() {
        expect(function() { sp.findRoute(0, 99); }).toThrow();
    });

    it("should return the correct shortest distance", function() {
        route = sp.findRoute(0, 4);
        expect(route.distance).toEqual(250);
    });

    it("should return the correct path steps in order", function() {
        route = sp.findRoute(0, 4);
        expect(route.path.length).toEqual(2);
        expect(route.path[0].source).toEqual(0);
        expect(route.path[0].target).toEqual(1);
        expect(route.path[1].source).toEqual(1);
        expect(route.path[1].target).toEqual(4);
    });

    it("should record the correct source and target on the result", function() {
        route = sp.findRoute(0, 4);
        expect(route.source).toEqual(0);
        expect(route.target).toEqual(4);
    });

    it("should return no path when the graph is disconnected", function() {
        var disconnectedPaths = [
            { source: 0, target: 1, distance: 100 },
            { source: 1, target: 2, distance: 100 }
        ];
        var spDisconnected = new ShortestPathCalculator(nodes, disconnectedPaths);
        var result = spDisconnected.findRoute(0, 4);
        expect(result.mesg).toEqual('No path found');
        expect(result.path).toBeNull();
    });

    it("should populate distances symmetrically for each path", function() {
        sp.makeDistanceArrayFromNodes();
        sp.populateDistances();
        expect(sp.distances[0][1]).toEqual(150);
        expect(sp.distances[1][0]).toEqual(150);
        expect(sp.distances[0][2]).toEqual(100);
        expect(sp.distances[2][0]).toEqual(100);
    });

    it("should leave unconnected node pairs as 'x' after populating distances", function() {
        sp.makeDistanceArrayFromNodes();
        sp.populateDistances();
        expect(sp.distances[0][4]).toEqual('x');
        expect(sp.distances[4][0]).toEqual('x');
    });

    it("should reject floats as non-integers", function() {
        expect(ShortestPathCalculator.isInteger(1.5)).toBeFalsy();
    });

    it("should reject empty string as non-integer", function() {
        expect(ShortestPathCalculator.isInteger('')).toBeFalsy();
    });

    it("should format a found route as an HTML result string", function() {
        sp.findRoute(0, 4);
        var result = sp.formatResult();
        expect(result).toContain('OK');
        expect(result).toContain('a -> b');
        expect(result).toContain('b -> e');
        expect(result).toContain('250');
    });

    it("should format a missing route with a no-path message", function() {
        var disconnectedPaths = [
            { source: 0, target: 1, distance: 100 },
            { source: 1, target: 2, distance: 100 }
        ];
        var spDisconnected = new ShortestPathCalculator(nodes, disconnectedPaths);
        spDisconnected.findRoute(0, 4);
        expect(spDisconnected.formatResult()).toContain('No path found');
    });

});
