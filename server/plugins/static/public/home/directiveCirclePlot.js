angular.module('brainConnectivity')
.directive('circlePlot',function($routeParams,$location,probtrack){


	function link($scope,$attrs,$filter){

		$scope.plotParameters = {};
		$scope.plotParameters.threshold = 0;

		 $scope.thresholdValue = function(){
    
		    if($scope.plotData){
		       $scope.plotVisible = true  ;
		      $scope.Plot();

		    }
		  }

		  $scope.Plot = function(){


		    var classes = $scope.plotData;
		    var thresholdDefaultValue = $scope.plotParameters.threshold;
		    console.log(thresholdDefaultValue);

		    $scope.plotVisible = true ;

		    // var TensionText = d3.select("body").append("div")
		    //         .attr("class", "TensionText") 
		    //         .append("text")
		    //         .text("Tension :");

		    // var Tension = d3.select("body").append("div")
		    //         .attr("class", "TensionSlide") 
		    //         .append("input")
		    //                   .attr("type","range")
		    //                   .attr("class","tensionBar")
		    //                   .attr("min",0)
		    //                   .attr("max",100)
		    //                   .attr("value",85);

		    // var DiameterText = d3.select("body").append("div")
		    //         .attr("class", "TensionText") 
		    //         .append("text")
		    //         .text("Diameter :");


		    // var Diameter = d3.select("body").append("div")
		    //         .attr("class", "DiameterSlide") 
		    //         .append("input")
		    //                   .attr("type","range")
		    //                   .attr("class","diameterBar")
		    //                   .attr("min",100)
		    //                   .attr("max",360)
		    //                   .attr("value",360);

		    //   var ThresholdText = d3.select("body").append("div")
		    //         .attr("class", "TensionText") 
		    //         .append("text")
		    //         .text("Threshold :");
		    
		    // var Threshold = d3.select("body").append("div")
		    //         .attr("class", "ValueThreshold") 
		    //         .append("input")
		    //                  .attr("type","number")
		    //                   .attr("step",0.1)
		    //                   .attr("class","valueThreshold")
		    //                   .attr("min",0)
		    //                   .attr("max",1)
		    //                   .attr("value",thresholdDefaultValue);
		                     
		    var diameter = 960,
		        radius = diameter / 2,
		        innerRadius = radius - 120;
		        //innerRadius = 120;



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
		        .attr("class", "circlePlot")   
		        .append("g")
		        .attr("transform", "translate(" + radius + "," + radius + ")");

		    var margin = {top: 10, right: 10, bottom: 190, left: 50},
		        width = 100 - margin.right - margin.left,
		        height = 800 - margin.top - margin.bottom;

		    var y = d3.scale.linear()
		        .range([height, 0]);

		    var svgColorbar = d3.select("body").append("svg")
		        .attr("width", width + margin.right + margin.left)
		        .attr("height", height + margin.top + margin.bottom)
		      .append("g")
		        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		    var gradient = svgColorbar.append("defs")
		      .append("linearGradient")
		        .attr("id", "gradient")
		        .attr("x1", "0%")
		        .attr("y1", "100%")
		        .attr("x2", "0%")
		        .attr("y2", "0%")
		        .attr("spreadMethod", "pad");

		    gradient.append("stop")
		        .attr("offset", "0%")
		        .attr("stop-color", d3.hsl(240,1,0.5))
		        .attr("stop-opacity", 1);

		    gradient.append("stop")
		        .attr("offset", "25%")
		        .attr("stop-color", d3.hsl(180,1,0.5))
		        .attr("stop-opacity", 1);

		    gradient.append("stop")
		        .attr("offset", "50%")
		        .attr("stop-color", d3.hsl(120,1,0.5))
		        .attr("stop-opacity", 1);

		    gradient.append("stop")
		        .attr("offset", "75%")
		        .attr("stop-color", d3.hsl(60,1,0.5))
		        .attr("stop-opacity", 1);
		        
		    gradient.append("stop")
		        .attr("offset", "100%")
		        .attr("stop-color", d3.hsl(0,1,0.5))
		        .attr("stop-opacity", 1);
		        
		    svgColorbar.append("rect")
		        .attr("class", "grid-background")
		        .attr("width", width)
		        .attr("height", height)
		        .style("fill", "url(#gradient)");

		    svgColorbar.append("g")
		        .attr("class", "axis")
		        //.attr("transform", "translate(0," + height + ")")
		        .call(d3.svg.axis().scale(y).orient("left").ticks(10));


		     var nodes = cluster.nodes($scope.packageHierarchy(classes));
		     console.log(thresholdDefaultValue);
		     var links = $scope.packageImports(nodes,thresholdDefaultValue);
		     splines = bundle(links);
		      var size = $scope.sizeMap(nodes,thresholdDefaultValue);

		      var path = svg.selectAll(".link")
		          .data(splines)
		          .enter()
		            .append("path")
		          .attr("class", "link")
		          .attr("stroke-width", function(d, i) { return (size[i]*35) + "px"; })
		          .attr("stroke",  function(d, i) { return $scope.colorHSV(size[i]); })            
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
		          .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })          .text(function(d) { return d.key; });



		          d3.select("input[class=tensionBar").on("change", function() {
		          	console.log("change");
		        line.tension(this.value / 100);
		        path.attr("d", function(d, i) { return line(splines[i]); });          
		      });



		//      console.log(eachNode);

		      d3.select(self.frameElement).style("height", diameter + "px");  

		      // d3.select("input[class=diameterBar]").on("change", function(){

		      //   console.log("change");
		      //   console.log(this.value);
		      //   cluster.size([360, this.value]);
		      //   var nodes = cluster.nodes(packageHierarchy(classes)),
		      //   links = packageImports(nodes,thresholdDefaultValue);
		      //   splines = bundle(links);
		      //   var newInnerRadius = this.value;
		      //   svg.selectAll("g").attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + newInnerRadius + ")"; });
		      //   path.attr("d",  function(d, i) { return line(splines[i]); });  

		      //  });

		  }

		  $scope.colorHSV = function(size,threshold){
		        var val = threshold / 240 ; 

		        var hue = size*240;
		        var color = d3.hsl(240-hue,1,0.5);
		        return color;
		    }
		       
		$scope.sizeMap = function (nodes,threshold) {
		    var size = [];
		    // Compute a map from name to node.
		      nodes.forEach(function(d) {
		       if (d.size) 
		        {
		            d.size.forEach(function(i) {
		          if (i > threshold) size.push(i);
		    });
		          
		        }
		  });    
		      console.log(size);
		   return size;
		}

		// Lazily construct the package hierarchy from class names.
$scope.packageHierarchy = function (classes) {
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
$scope.packageImports = function (nodes, threshold) {
  var map = {},
      imports = [];
      console.log(nodes);
  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) d.imports.forEach(function(i,r) {
    	console.log(threshold);
      if(d.size[r]>threshold)  {
      	imports.push({source: map[d.name], target: map[i]});
      }
    });
  });
  console.log(imports);
  return imports;
}

		$scope.$watch("plotParameters.threshold", function(){
		    console.log("HelloWatch", $scope.plotParameters.threshold);
		    $scope.thresholdValue();
		  });

		$scope.$watch("plotData", function()
			{
			if($scope.plotData){
				$scope.plotParameters.plotData = $scope.plotData;
				$scope.Plot();
			}


			});
		
	}

  return {
    restrict : 'E',
    scope: {
    	plotData : "="
    },
    link : link,
    templateUrl: 'home/directiveCirclePlotTemplate.html'


  }
})