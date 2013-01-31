/*
 *
 * Misc utilities for running dijkstra algorithm and plotting
 * output with d3 js
 *
 */

SpUtils = {};

SpUtils.targetDivForTable = 'distances';
SpUtils.targetDivForGraph = 'graph';

SpUtils.minNodesforDemo = 3;
SpUtils.maxNodesforDemo = 20;

SpUtils.nodeNames = 'abcdefghijklmnopqrstuvwxyz';

SpUtils.findRoute = function(nodes, paths) {

	var distances = SpUtils.makeDistanceArrayFromNodes(nodes);
	distances = SpUtils.populateDistances(distances, paths);
	return dijkstra(distances, 0, (nodes.length-1) );

}

SpUtils.drawGraph = function(svg, nodes, paths, result) {

	nodes.forEach(function(d, i) { d.x = d.y = map.width / nodes.length * i});

	var force = d3.layout.force()
		.nodes(nodes)
		.links(paths)
		.charge(-500)
		.linkDistance(function(d){ return d.distance; })
		.size([map.width, map.height]);

	force.on("tick", function(e) {
		svg.selectAll("path")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});

	var j = nodes.length*20;
	force.start();
	for (var i = j * j; i > 0; --i) force.tick();
	force.stop();

	svg.selectAll("line")
		.data(paths)
		.enter()
			.append("line")
				.attr("class", function(d) { 
					if(result&&(result.path.indexOf(d.source.index)===result.path.indexOf(d.target.index)-1)) 
						return "link bold";
					else
						return "link"
				})
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

	svg.append("svg:g")
		.selectAll("circle")
			.data(nodes)
			.enter()
				.append("svg:circle")
					.attr("class", "node")
					.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; })
					.attr("r",  function(d) { return 15; });

	svg.append("svg:g")
		.selectAll("text")
			.data(nodes)
			.enter()
				.append("svg:text")
					.attr("class", "label")
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
					.attr("text-anchor", "middle")
					.attr("y", ".3em")
					.text(function(d) { return d.value; });

}

SpUtils.makeTable = function(nodes) {

	nodes = parseInt(nodes);

	if(nodes>SpUtils.maxNodesforDemo) {
		alert("Maximum nodes for this demo is " + SpUtils.maxNodesforDemo)
		return;
	}

	if(nodes<SpUtils.minNodesforDemo) {
		alert("You need at least 3 nodes to calculate a shortest path")
		return;
	}

	var table = document.createElement('table');
	SpUtils.addElementProperty(table,"class", "input");
	var greyCol = 0;

	for (var tr_i=0; tr_i < (nodes + 1); tr_i++) {

	    var tr = document.createElement('tr');

	    for(var td_i=0; td_i < (nodes + 1); td_i++) {

	    	if(tr_i===0) {
	    		if(td_i===0) {
					var td = document.createElement('th');
					td.appendChild(document.createTextNode('node'));
	    		}
	    		else {
					var td = document.createElement('th');
					td.appendChild(document.createTextNode(SpUtils.nodeNames[td_i-1]));
				}
			}
			else {
	    		if(td_i===0) {
					var td = document.createElement('th');
					td.appendChild(document.createTextNode(SpUtils.nodeNames[tr_i-1]));
				}
				else
				{
					var td = document.createElement('td');
					if(td_i > greyCol)
						td.appendChild(SpUtils.makeTextInput(td_i-1, tr_i-1));
					else
						td.appendChild(document.createTextNode('-'));
				}
			}

			tr.appendChild(td);

		}

		greyCol++;
	    table.appendChild(tr);
	}

	target = SpUtils.clearDiv(SpUtils.targetDivForTable);

	target.appendChild(table);

	var submit = SpUtils.makeSubmitInput(" make visualisation ")

	target.appendChild(submit);

}

SpUtils.clearDiv = function(elementId) {
	var target = document.getElementById(elementId);

	if(!target) return -1;

	while(target.firstChild)
		target.removeChild(target.firstChild);

	return target;
}

SpUtils.makeTextInput = function(from, to) {
	var input = document.createElement('input');
	var field = from.toString() + ':' + to.toString();
	input = SpUtils.addElementProperty(input,"type", "text");
	input = SpUtils.addElementProperty(input,"name", field);
	input = SpUtils.addElementProperty(input,"class", 'spdist');
	input = SpUtils.addElementProperty(input,"id",   field);
	input = SpUtils.addElementProperty(input,"size", "3");
	return input;
}

SpUtils.makeSubmitInput = function(value) {
	var input = document.createElement('input');
	input = SpUtils.addElementProperty(input,"type", "submit");
	input = SpUtils.addElementProperty(input,"value", value);
	input = SpUtils.addElementProperty(input,"onclick", function() { SpUtils.callDrawGraph(); });
	return input;
}

SpUtils.addElementProperty = function(element,newProperty,newValue) {
	if (document.all)
		element[newProperty] = newValue;
	else if (document.getElementById)
		element.setAttribute(newProperty, newValue);

	if(newProperty.toLowerCase()=='class')
		element.className = newValue;
	if(newProperty.toLowerCase()=='onblur')
		element.onblur = newValue;
	if(newProperty.toLowerCase()=='onclick')
		element.onclick = newValue;
	
	return element;
}

SpUtils.callDrawGraph = function()
{
	var paths = [];
	var tmpnd = [];

	var distances = document.getElementsByClassName("spdist");

	for(var i=0; i<distances.length; i++) { 
		if(distances[i].value != '' && parseInt(distances[i].value) && distances[i].value != 0) {
			var fields = distances[i].name.split(':');
			// alert(fields[0] + ' - ' + fields[1] + ' - ' + distances[i].value);
			paths.push({ source: parseInt(fields[0]), target: parseInt(fields[1]), distance: parseInt(distances[i].value) });
			tmpnd.push(parseInt(fields[0]),parseInt(fields[1]));
		}
	}

	if(paths.length===0) {
		alert("No distances entered..");
		return -1;
	}

	var nodes = SpUtils.sortUniqueNodesFromDistances(tmpnd)

	var svg = d3.select("#graph svg");  // TODO fix ref

	svg.selectAll("line").remove();
	svg.selectAll("circle").remove();
	svg.selectAll("text").remove();

	var route = SpUtils.findRoute(nodes, paths);

	document.getElementById('results').innerHTML  = SpUtils.formatResult(route, nodes);

	SpUtils.drawGraph(svg, nodes, paths, route);

}

SpUtils.sortUniqueNodesFromDistances = function(distances) {

	distances = distances.sort(function (a, b) { return a*1 - b*1; });

	var index = parseInt(distances[0]);

    var nodes = [{ index: index, value: SpUtils.nodeNames[index].toString() }];

    for (var i = 1; i < distances.length; i++) {
        if (distances[i-1] !== distances[i]) {
        	index = parseInt(distances[i]);
            nodes.push({ index: index, value: SpUtils.nodeNames[index].toString() });
        }
    }

    return nodes;

}

SpUtils.populateDistances = function(distances, paths) {

	for(var i=0; i<paths.length; i++) {

		var s = parseInt(paths[i].source);
		var t = parseInt(paths[i].target);
		var d = parseInt(paths[i].distance);

		distances[s][t] = d;
		distances[t][s] = d;
	}

	return distances;

}

SpUtils.makeDistanceArrayFromNodes = function(nodes) {

	var distances = [];

	for(var i=0; i<nodes.length; i++) {

		distances[i] = new Array();

		for(var j=0; j<nodes.length; j++){
			distances[i][j] = 'x';
		}
	}

	return distances;

}


SpUtils.formatResult = function(result, nodes) {

	// result => {mesg:"OK", path:[0, 1, 4], distance:250}

	var res = "";

	res += "<p>Result : " + result.mesg + "</p>";
	res += "<p>Path   : ";

	for(var i=0; i<result.path.length; i++) {
		var nodeIndex = result.path[i];
		var node = nodes[nodeIndex];
		res += node.value + ' ';
	}
	res += "</p>";
	res += "<p>Distance : " + result.distance + "</p>";

	return res;

}

