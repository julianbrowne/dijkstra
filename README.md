
###Dijkstra's Shortest Path

This is a collection of simple javascripts to illustrate Dijkstra's famous algorithm

Simply download the whole lot and open index.html in a browser. There are some basic jasmine tests to ensure the utility functions (mostly handy shortcuts for DOM manipulation) are working fine. These can be run by viewing tests/index.html

The wrap around explanatory text can be found at:

http://www.julianbrowne.com/article/viewer/shortest-path

**Usage**

Create some 'nodes' in a format that can be parsed by d3.js:

    var nodes = [
        { index: 0, value: 'a', r: 20 },
        { index: 1, value: 'b', r: 20 },
        { index: 2, value: 'c', r: 20 },
        { index: 3, value: 'd', r: 20 },
        { index: 4, value: 'e', r: 20 }
    ];

and some 'paths' between the nodes:

    var paths = [
        { source: 0, target: 1, distance: 150 },
        { source: 0, target: 2, distance: 100 },
        { source: 2, target: 3, distance: 100 },
        { source: 2, target: 4, distance: 160 },
        { source: 1, target: 3, distance: 40  },
        { source: 3, target: 4, distance: 100 },
        { source: 1, target: 4, distance: 100 }
    ];

distances ultimately become pixels, so don't make them too big.

Now fire up a calculator:

    var sp = new ShortestPathCalculator(nodes, paths);

Find a route through the nodes:

    var route = sp.findRoute(0,4);

route is now an object that looks like this:

    {
        "mesg":"OK",
        "path": [
            {"target":1,"source":0},
            {"target":4,"source":1}
        ],
        "source":0,
        "target":4,
        "distance":250
    }

So the shortest path bit is done.

Additionally, you can format the result for display and graph it using d3.js

    var result = sp.formatResult();

    document.getElementById('results').innerHTML = result;

    sp.drawGraph('graph');

