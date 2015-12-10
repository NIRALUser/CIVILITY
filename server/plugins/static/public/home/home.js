

angular.module('brainConnectivity')
.controller('firstController', ['$scope', function($scope) {

	$scope.exampleD3 = {
		"this is an example" : 123,
		arr: [1,2]
	}


	$scope.readMatrixFile = function(){
		var file = document.getElementById('file1').files[0];
	    if(!file) {  alert ("No matrix file selected "); }
	    var reader = new FileReader();
	    reader.onload = function(progressEvent){
		    // Entire file
		    console.log(this.result);
		    // By lines
		    var lines = this.result.split('\n');
		    var matrix = [];            

		    //console.log(lines.length);
		    for(var line = 0; line < lines.length; line++){      
		        //console.log(lines[line]);
		        var rows = [];
		        var values = lines[line].split(' ');
		        for(var val = 0; val < values.length; val++){
		            //console.log(values[val]);
		            rows.push(values[val]);
		        }
		        //console.log(rows.length);
		        if( rows.length != lines.length )
		        {
		            //console.log("Matrix dimension wrong");
		        }
		        matrix.push(rows);
		    }
		    //console.log(matrix);
	        return matrix;
	  };
	  reader.readAsText(file);
	}


	var colormapping = ["rgb(255,0,0)",  "rgb(255,85,0)", "rgb(255,170,0)",
 "rgb(255,255,0)", "rgb(170,255,85)", "rgb(85,255,170)", "rgb(0,255,255)",
"rgb(0,170,255)", "rgb(0,85,255)", "rgb(0,0,255)","rgb(0,0,170)"];

var diameter = 960,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.layout.cluster()
    .size([360, innerRadius])
    .sort(null)
    .value(function(d) { return d.size; });

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.85)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var splines = [];    
var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");
d3.json("data/connectivity.json", function(error, classes) {
  if (error) throw error;

var svg2 =  d3.select("body").append("svg")
	  .attr("width", 75)
    .attr("height", 960)

var colorBar = svg2.selectAll("rectangle")
		  .data(colormapping)
		  .enter()
		  .append("rect");

var textColorBar = [" 0.9 <= connectivity value <= 1.0", "0.8 <= connectivity value < 0.9", 
"0.7 <= connectivity value < 0.8", "0.6 <= connectivity value < 0.7", "0.5 <= connectivity value < 0.6",
"0.4 <= connectivity value < 0.5", "0.3 <= connectivity value < 0.4", "0.2 <= connectivity value < 0.3",
"0.1 <= connectivity value < 0.2", "0.0 < connectivity value < 0.1", "connectivity value = 0.0"

]

var rectAttributes = colorBar
	      .attr("class", "rect")
	      .attr("x", 20)
	      .attr("y",function(d,i ){return i*50+215})
	      .attr("width",50)
	      .attr("height",function(d,i){ if(i==10) return 10;
		  else return 50;})
	      .attr("fill", function(d){return d})
	       .on("mouseover", function(d,i) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html( textColorBar[i] )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY + 28) + "px")
		.attr("id", "tooltipColor")
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
	      ;

  var nodes = cluster.nodes(packageHierarchy(classes)),
      links = packageImports(nodes);
 splines = bundle(links);
  var size = sizeMap(nodes);
  
  var colormap = colorMap(size,colormapping);
  var path = svg.selectAll(".link")
      .data(splines)
      .enter()
        .append("path")
      .attr("class", "link")
      .attr("stroke-width", function(d, i) { return (size[i]*17) + "px"; })
      .attr("stroke",  function(d, i) { return d3.rgb(colormap[i]);
          var color = colorMap[i];
           var rgb = d3.rgb(color); })            
      .attr("d", line)
      .on("mouseover", function(d,i) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html( "Connectivity value : " + size[i] )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY + 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
      ;

  svg.selectAll(".node")
      .data(nodes.filter(function(n) { return !n.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    .append("text")
      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
      .text(function(d) { return d.key; });
      d3.select("input[type=range]").on("change", function() {
    line.tension(this.value / 100);
    path.attr("d", function(d, i) { return line(splines[i]); });          
  });
    
});

d3.select(self.frameElement).style("height", diameter + "px");   
     
function colorMap(size,colormapping) {
  var colorMap = [];
  size.forEach(function(d) {
 
    if( (d > 0.0) && (d < 0.1) ){
       var color = colormapping[9];
       colorMap.push(color)          
  }
    else if (  (d >= 0.1) && (d < 0.2)  ) {
           var color = colormapping[8];
           colorMap.push(color)         
    }
    else if (  (d >= 0.2) && (d < 0.3)  ) {
           var color = colormapping[7];
           colorMap.push(color)         
    } 
    else if (  (d >= 0.3) && (d < 0.4)  ) {
           var color = colormapping[6];
           colorMap.push(color)         
    }
    else if (  (d >= 0.4) && (d < 0.5)  ) {
           var color = colormapping[5];
           colorMap.push(color)         
    }
    else if (  (d >= 0.5) && (d < 0.6)  ) {
           var color = colormapping[4];
           colorMap.push(color)         
    }
    else if (  (d >= 0.6) && (d < 0.7)  ) {
           var color = colormapping[3];
           colorMap.push(color)         
    }
    else if (  (d >= 0.7) && (d < 0.8)  ) {
           var color = colormapping[2];
           colorMap.push(color)         
    }
    else if (  (d >= 0.8) && (d < 0.9)  ) {
           var color = colormapping[1];
           colorMap.push(color)         
    }
    else if (  (d >= 0.9) && (d <= 1.0)  ) {
           var color = colormapping[0];
           colorMap.push(color)         
    }
    else {
           var color = colormapping[10];
           colorMap.push(color) 
    }
});
        return colorMap;
}
    
function sizeMap(nodes) {
    var size = [];
    // Compute a map from name to node.
      nodes.forEach(function(d) {
       if (d.size) d.size.forEach(function(i) {
      size.push(i);
    });
  });    
   return size;
}
    
    
    
// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return map[""];
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) d.imports.forEach(function(i) {
      imports.push({source: map[d.name], target: map[i]});
    });
  });

  return imports;
}

/*function mouse(e) {
  return [e.pageX - rx, e.pageY - ry];
}

function mousedown() {
  m0 = mouse(d3.event);
  d3.event.preventDefault();
}

function mousemove() {
  if (m0) {
    var m1 = mouse(d3.event),
        dm = Math.atan2((m0, m1), dot(m0, m1)) * 180 / Math.PI;
    div.style("-webkit-transform", "translateY(" + (ry - rx) + "px)rotateZ(" + dm + "deg)translateY(" + (rx - ry) + "px)");
  }
}

function mouseup() {
  if (m0) {
    var m1 = mouse(d3.event),
        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

    rotate += dm;
    if (rotate > 360) rotate -= 360;
    else if (rotate < 0) rotate += 360;
    m0 = null;

    div.style("-webkit-transform", null);

    svg.attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
      .selectAll("g.node text")
        .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -8; })
        .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
  }
}

function mouseover(d) {
  svg.selectAll("path.-" + d.key)
      .classed("target", true)
      .each(updateNodes("source", true));

  svg.selectAll("path.link.source-" + d.key)
      .classed("source", true)
      .each(updateNodes("target", true));
}

function mouseout(d) {
  svg.selectAll("path.link.source-" + d.key)
      .classed("source", false)
      .each(updateNodes("target", false));

  svg.selectAll("path.link.target-" + d.key)
      .classed("target", false)
      .each(updateNodes("source", false));
}

function updateNodes(name, value) {
  return function(d) {
    if (value) this.parentNode.appendChild(this);
    svg.select("#node-" + d[name].key).classed(name, value);
  };
}
    
function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}    */


}]);