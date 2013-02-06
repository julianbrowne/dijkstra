/*
 *
 * Random handy DOM utils for ShortestPathCalculator
 *
 */

var ShortestPathUtils = {

        targetDivForResults: 'results2',
        targetDivForTable:   'distances2',
        targetDivForGraph:   'graph2',

        minNodesforDemo: 3,
        maxNodesforDemo: 20,

        nodeNames: 'abcdefghijklmnopqrstuvwxyz',

        makeTable: function(nodes) {

            var integerRegex = /^\d+$/;

            if(!integerRegex.test(nodes)) return;

            nodes = parseInt(nodes);

            if(nodes>ShortestPathUtils.maxNodesforDemo) {
                alert("Maximum nodes for this demo is " + ShortestPathUtils.maxNodesforDemo)
                return;
            }

            if(nodes<ShortestPathUtils.minNodesforDemo) {
                alert("You need at least 3 nodes to calculate a shortest path")
                return;
            }

            var table = document.createElement('table');
            ShortestPathUtils.addElementProperty(table,"class", "input");
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
                            td.appendChild(document.createTextNode(ShortestPathUtils.nodeNames[td_i-1]));
                        }
                    }
                    else {
                        if(td_i===0) {
                            var td = document.createElement('th');
                            td.appendChild(document.createTextNode(ShortestPathUtils.nodeNames[tr_i-1]));
                        }
                        else
                        {
                            var td = document.createElement('td');
                            if(td_i > greyCol)
                                td.appendChild(ShortestPathUtils.makeTextInput(td_i-1, tr_i-1));
                            else
                                td.appendChild(document.createTextNode('-'));
                        }
                    }

                    tr.appendChild(td);

                }

                greyCol++;
                table.appendChild(tr);
            }

            target = ShortestPathUtils.clearDiv(ShortestPathUtils.targetDivForTable);

            target.appendChild(table);

            var p0 = document.createElement('p');

            var p1 = document.createElement('span');
            p1.innerHTML = " From : ";
            p0.appendChild(p1);

            var sourceDropDown = ShortestPathUtils.makeDropDown("source", nodes);
            p0.appendChild(sourceDropDown);

            var p2 = document.createElement('span');
            p2.innerHTML = " To : ";
            p0.appendChild(p2);

            var targetDropDown = ShortestPathUtils.makeDropDown("target", nodes);
            p0.appendChild(targetDropDown);

            var submit = ShortestPathUtils.makeSubmitInput(" find route ");
            p0.appendChild(submit);

            target.appendChild(p0);

        },

        clearDiv: function(elementId) {
            var target = document.getElementById(elementId);

            if(!target) return -1;

            while(target.firstChild)
                target.removeChild(target.firstChild);

            return target;
        },

        makeTextInput: function(from, to) {
            var input = document.createElement('input');
            var field = from.toString() + ':' + to.toString();
            input = ShortestPathUtils.addElementProperty(input,"type", "text");
            input = ShortestPathUtils.addElementProperty(input,"name", field);
            input = ShortestPathUtils.addElementProperty(input,"class", 'spdist');
            //input = ShortestPathUtils.addElementProperty(input,"onblur", function() { ShortestPathUtils.callDrawGraph(); });
            input = ShortestPathUtils.addElementProperty(input,"id",   field);
            input = ShortestPathUtils.addElementProperty(input,"size", "3");
            return input;
        },

        makeSubmitInput: function(value) {
            var input = document.createElement('input');
            input = ShortestPathUtils.addElementProperty(input,"type", "submit");
            input = ShortestPathUtils.addElementProperty(input,"value", value);
            input = ShortestPathUtils.addElementProperty(input,"onclick", function() { ShortestPathUtils.callDrawGraph(); });
            return input;
        },

        makeDropDown: function(value, nodes) {
            var input = document.createElement('select');
            input = ShortestPathUtils.addElementProperty(input,"id", value);
            input = ShortestPathUtils.addElementProperty(input,"name", value);

            for(var i=0; i<nodes; i++) {
                var option = document.createElement('option');
                option = ShortestPathUtils.addElementProperty(option, "value", i);
                option.innerHTML = ShortestPathUtils.nodeNames[i];
                input.appendChild(option);
            }

            return input;
        },

        addElementProperty: function(element,newProperty,newValue) {
            if (document.all)
                element[newProperty] = newValue;
            else if (document.getElementById)
                element.setAttribute(newProperty, newValue);

            if(newProperty.toLowerCase()=='class')
                element.className = newValue;
            if(newProperty.toLowerCase()=='onblur')
                element.onblur = newValue;
            if(newProperty.toLowerCase()=='onchange')
                element.onblur = newValue;
            if(newProperty.toLowerCase()=='onclick')
                element.onclick = newValue;
            
            return element;
        },

        callDrawGraph: function() {

            var paths = [];
            var tmpnd = [];

            if(document.getElementsByClassName)
                var distances = document.getElementsByClassName("spdist");
            else
                var distances = document.querySelectorAll('.spdist');
            
            var source = document.getElementById("source").options[document.getElementById("source").selectedIndex].value;
            var target = document.getElementById("target").options[document.getElementById("target").selectedIndex].value;

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

            var nodes = ShortestPathUtils.sortUniqueNodesFromDistances(tmpnd);

            var sp = new ShortestPathCalculator(nodes, paths);

            var route = sp.findRoute(source, target);

            var result = sp.formatResult();

            document.getElementById(ShortestPathUtils.targetDivForResults).innerHTML = result;

            sp.drawGraph(ShortestPathUtils.targetDivForGraph, 800, 400);

        },

        sortUniqueNodesFromDistances: function(distances) {

            distances = distances.sort(function (a, b) { return a*1 - b*1; });

            var index = parseInt(distances[0]);

            var nodes = [{ index: index, value: ShortestPathUtils.nodeNames[index].toString() }];

            for (var i = 1; i < distances.length; i++) {
                if (distances[i-1] !== distances[i]) {
                    index = parseInt(distances[i]);
                    nodes.push({ index: index, value: ShortestPathUtils.nodeNames[index].toString() });
                }
            }

            return nodes;

        }

}