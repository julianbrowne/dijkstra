/*
 *
 * Dijkstra Short Path Calculator and Graph Plotter
 * Uses D3 JS (V3)
 *
 */

var ShortestPathCalculator = function(nodes, paths) {

	this.nodes = nodes; // nodes => [ { index: 0, value: 'a', r: 20 }, ... ]
	this.paths = paths; // paths => [ { source: 0, target: 1, distance: 150 }, ... ]
	this.distances = []; // [ [ x, 100, 150 ], [ 100, x, 10] ]
	this.graph = {};

	var maxNodes = 20;
	var minNodes = 3;

	if(!d3) throw new ShortestPathCalculator.SpcError(10, 'D3 library not found');

	if(!nodes.length || nodes.length > maxNodes || nodes.length < minNodes)
		throw new ShortestPathCalculator.SpcError(11, 'Nodes format invalid => ' + JSON.stringify(nodes) );

}

ShortestPathCalculator.isInteger = function(i) {
	return /^\d+$/.test(i);
}

ShortestPathCalculator.SpcError = function(code, message) {
	console.log(message);
	//alert(message);
	return { code: code, message: message };
}

ShortestPathCalculator.prototype.findRoute = function(source, target) {

	if(!ShortestPathCalculator.isInteger(source) || !ShortestPathCalculator.isInteger(target))
		throw new ShortestPathCalculator.SpcError(20, "Source and target must be ints");

	if(source > this.nodes.length - 1|| target > this.nodes.length - 1)
		throw new ShortestPathCalculator.SpcError(21, "Source or target put of range");

	this.makeDistanceArrayFromNodes();

	this.populateDistances();

	this.result = this.dijkstra(source, target);

	return this.result;

}

ShortestPathCalculator.prototype.makeDistanceArrayFromNodes = function() {

	this.distances = [];

	for(var i=0; i<this.nodes.length; i++) {

		this.distances[i] = [];

		for(var j=0; j<this.nodes.length; j++){
			this.distances[i][j] = 'x';
		}
	}

}

ShortestPathCalculator.prototype.populateDistances = function() {

	for(var i=0; i<this.paths.length; i++) {

		var s = parseInt(this.paths[i].source);
		var t = parseInt(this.paths[i].target);
		var d = parseInt(this.paths[i].distance);

		this.distances[s][t] = d;
		this.distances[t][s] = d;
	}

}

ShortestPathCalculator.clearDiv = function(elementId) {
	var target = document.getElementById(elementId);

	if(!target) return -1;

	while(target.firstChild)
		target.removeChild(target.firstChild);

	return target;
}

ShortestPathCalculator.prototype.makeSVG = function(elementId, width, height) {

	this.graph.width  = width  ? width  : 800;
	this.graph.height = height ? height : 400;

	ShortestPathCalculator.clearDiv(elementId);

	var target = d3.select('#' + elementId);

	this.graph.svg = target.append("svg:svg")
		.attr("width", this.graph.width)
		.attr("height", this.graph.height);

}

ShortestPathCalculator.prototype.drawGraph = function(elementId, width, height) {

	if(!this.graph.svg)
		this.makeSVG(elementId, width, height);

	var that = this;

	this.nodes.forEach(function(d, i) { d.x = d.y = that.graph.width / that.nodes.length * i});

	var force = d3.layout.force()
		.nodes(this.nodes)
		.links(this.paths)
		.charge(-500)
		.linkDistance(function(d){ return d.distance; })
		.size([this.graph.width, this.graph.height]);

	force.on("tick", function(e) {
		that.graph.svg.selectAll("path")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});

	var j = this.nodes.length*20;
	force.start();
	for (var i = j * j; i > 0; --i) force.tick();
	force.stop();

	this.graph.svg.selectAll("line")
		.data(this.paths)
		.enter()
			.append("line")
				.attr("class", function(d) {
					if(that.result.path !== null) {
						for (var i = 0; i < that.result.path.length; i++) {
							if ((that.result.path[i].source === d.source.index && that.result.path[i].target === d.target.index)
							 || (that.result.path[i].source === d.target.index && that.result.path[i].target === d.source.index))
								return 'link bold';
						}
					}
					return 'link';
				})
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

	this.graph.svg.append("svg:g")
		.selectAll("circle")
			.data(this.nodes)
			.enter()
				.append("svg:circle")
					.attr("class", "node")
					.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; })
					.attr("r",  function(d) { return 15; });

	this.graph.svg.append("svg:g")
		.selectAll("text")
			.data(this.nodes)
			.enter()
				.append("svg:text")
					.attr("class", "label")
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
					.attr("text-anchor", "middle")
					.attr("y", ".3em")
					.text(function(d) { return d.value; });

}

ShortestPathCalculator.prototype.formatResult = function() {

	// result => {mesg:"OK", path:[0, 1, 4], distance:250}

	var res = "";

	res += "<p>Result : " + this.result.mesg + "</p>";

	if(this.result.path === null)
		return "<p>No path found from " + this.result.source + " to " + this.result.target + "</p>";

	if(this.result.path.length === 0)
		return "<p>Path is from " + SpUtils.nodeNames[this.result.source] + " to "
			+ SpUtils.nodeNames[this.result.target] + ". Expect a journey time of approximately zero.</p>"

	res += "<p>Path   : ";

	for(var i=0; i<this.result.path.length; i++) {
		var sourceNodeIndex = this.result.path[i].source;
		var targetNodeIndex = this.result.path[i].target;
		var sourceNode = this.nodes[sourceNodeIndex];
		var targetNode = this.nodes[targetNodeIndex];
		res += ' ' + sourceNode.value + ' -> ' + targetNode.value;
	}
	res += "</p>";
	res += "<p>Distance : " + this.result.distance + "</p>";

	return res;

}

/*
 *
 * Calculate shortest path between two nodes in a graph
 * 
 * @param {Integer} start     index of node to start from
 * @param {Integer} end       index of node to end at
 *
 */

ShortestPathCalculator.prototype.dijkstra = function(start, end) {

    var nodeCount = this.distances.length,
        infinity = 99999,  // larger than largest distance in distances array
        shortestPath = new Array(nodeCount),
        nodeChecked  = new Array(nodeCount),
        pred         = new Array(nodeCount);

    // initialise data placeholders

    for(var i=0; i<nodeCount; i++) {
        shortestPath[i] = infinity;
        pred[i]=null;
        nodeChecked[i]=false;
    }

    shortestPath[start]=0;

    for(var i=0; i<nodeCount; i++) {

        var minDist = infinity;
        var closestNode = null;
        
        for (var j=0; j<nodeCount; j++) {

            if(!nodeChecked[j]) {
                if(shortestPath[j] <= minDist) {
                    minDist = shortestPath[j];
                    closestNode = j;
                }
            }
        }

        nodeChecked[closestNode] = true;

        for(var k=0; k<nodeCount; k++) {
            if(!nodeChecked[k]){
                var nextDistance = distanceBetween(closestNode, k, this.distances);

                if ((parseInt(shortestPath[closestNode]) + parseInt(nextDistance)) < parseInt(shortestPath[k])){
                    soFar = parseInt(shortestPath[closestNode]);
                    extra = parseInt(nextDistance);
                    
                    shortestPath[k] = soFar + extra;
                    
                    pred[k] = closestNode;
                }
            }
        }
                
    }
  
    if(shortestPath[end] < infinity) {

        var newPath = [];
        var step    = { target: parseInt(end) };

        var v = parseInt(end);

        //console.log('v');
        //console.log(v);
        
        while (v>=0) {

            v = pred[v];

            //console.log('v');
            //console.log(v);

            if (v!==null && v>=0) {
                step.source = v;
                newPath.unshift(step);
                step = {target: v};
            }

        }

        totalDistance = shortestPath[end];
        
        return {mesg:'OK', path: newPath, source: start, target: end, distance:totalDistance};
    } 
    else {
        return {mesg:'No path found', path: null, source: start, target: end, distance: 0 };
    }
    
    function distanceBetween(fromNode, toNode, distances) {

        dist = distances[fromNode][toNode];

        if(dist==='x') dist = infinity;
        
        return dist;
    }

}


