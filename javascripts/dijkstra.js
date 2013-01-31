/*
 *
 * Calculate shortest path between two nodes in a graph
 * 
 * @param {Array}   distances array of distances (nodes x nodes big)
 * @param {Integer} start     index of node to start from
 * @param {Integer} end       index of node to end at
 *
 */

function dijkstra(distances, start, end) {

    var nodeCount = distances.length,
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
                var nextDistance = distanceBetween(closestNode, k);

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
    
    function distanceBetween(fromNode, toNode) {

        dist = distances[fromNode][toNode];

        if(dist==='x') dist = infinity;
        
        return dist;
    }

}
