angular.module('brainConnectivity')
.directive('circlePlot',function($routeParams,$location,probtrack){


	function link($scope,$attrs,$filter){

		$scope.plotParameters = {};
		$scope.plotParameters.threshold = 0;
		$scope.plotParameters.diameter = 960;
		$scope.plotParameters.tension = 0.85;
		$scope.plotParameters.upperValue = 1;

		 $scope.thresholdValue = function(){
    
		    if($scope.plotData){
		    	$scope.removeOldPlot();
		       	$scope.plotVisible = true  ;
		      	$scope.Plot();
		    }
		  }

		  $scope.diameterValue = function(){
    
		    if($scope.plotData){
		    	
		    	$scope.removeOldPlot();
		       	$scope.plotVisible = true  ;
		       	$scope.Plot();
		    }
		  }

		  $scope.tensionValue = function(){
    
		    if($scope.plotData){
		    	$scope.removeOldPlot();
		       	$scope.plotVisible = true  ;
		      	$scope.Plot();
		    }
		  }

		  $scope.upperValue = function(){
    
		    if($scope.plotData){
		    	$scope.removeOldPlot();
		       	$scope.plotVisible = true  ;
		      	$scope.Plot();
		    }
		  }

		  $scope.removeOldPlot = function()
		  {
		  	console.log("REMOVE");
		  	var circlePlot = document.getElementById("circlePlot");
		  	circlePlot.parentNode.removeChild(circlePlot);
		  	
		  	var colorBar = document.getElementById("colorBar");
		  	colorBar.parentNode.removeChild(colorBar);
		  		
		  	var tooltip = document.getElementById("tooltip");
		  	tooltip.parentNode.removeChild(tooltip);
		  }

		  $scope.Plot = function(){

		    var classes = $scope.plotData;
		    var thresholdDefaultValue = $scope.plotParameters.threshold;
		    var diameter = $scope.plotParameters.diameter;
		    var tensionSplines = $scope.plotParameters.tension;
		    var upperValue = $scope.plotParameters.upperValue;

		    if(upperValue != 0)
		    {
		    	if(upperValue <= thresholdDefaultValue) alert("The maximum upper value should be superior to the threshold value");

		    }

		    console.log(thresholdDefaultValue);

		    $scope.plotVisible = true ;
		    
		    var radius = diameter / 2,
		        innerRadius = radius - 120;

		    var cluster = d3.layout.cluster()
		        .size([360, innerRadius])
		        .sort(null)
		        .value(function(d) { return d.size; });


		    var bundle = d3.layout.bundle();

		    var line = d3.svg.line.radial()
		        .interpolate("bundle")
		        .tension(tensionSplines)
		        .radius(function(d) { return d.y; })
		        .angle(function(d) { return d.x / 180 * Math.PI; });

		    // Define the div for the tooltip
		    var div = d3.select("body").append("div") 
		        .attr("class", "tooltip")
		        .attr("id", "tooltip")        
		        .style("opacity", 0);

		      var margin = {top: 15, right: 10, bottom: 15, left: 50},
		        width = 100 - margin.right - margin.left,
		        height = diameter;

		    var divPlot = d3.select("body").append("div")
		     	.attr("width", diameter + 100)
		        .attr("height", diameter + margin.bottom)
		        .attr("class", "divPlot");


		    var splines = [];    
		    var svg = d3.select(".divPlot").append("svg")
		         .attr("width", diameter)
		         .attr("height", diameter + margin.bottom)
		        .attr("class", "circlePlot")
		        .attr("id", "circlePlot")   
		        .append("g")
		        .attr("transform", "translate(" + radius + "," + radius + ")");

		  

		    var y = d3.scale.linear()
		        .range([height, 0])
		        .domain([thresholdDefaultValue, upperValue]);

		     

		    var svgColorbar = d3.select(".divPlot").append("svg")
		        .attr("width", width + margin.right + margin.left)
		        .attr("height", diameter + margin.bottom)//+ margin.top + margin.bottom )
		        .attr("id", "colorBar")
		        .attr("class", "colorBar")
		      .append("g")
		        .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");

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

		      var sizeOfLinksRatio = diameter/27;

		      var MinMax = upperValue - thresholdDefaultValue; 

		      var path = svg.selectAll(".link")
		          .data(splines)
		          .enter()
		            .append("path")
		          .attr("class", "link")
		          .attr("stroke-width", function(d, i) { return (size[i]*sizeOfLinksRatio) + "px"; })
		          .attr("stroke",  function(d, i) { 
		          			if(size[i] >= upperValue)
		          			{
		          				return $scope.colorHSV("max",0,1);

		          			}
		          			else
		          			{
		          				return $scope.colorHSV(size[i],thresholdDefaultValue,upperValue); 	
		          			}
		          	})            
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



		      //     d3.select("input[class=tensionBar").on("change", function() {
		      //     	console.log("change");
		      //   line.tension(this.value / 100);
		      //   path.attr("d", function(d, i) { return line(splines[i]); });          
		      // });



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

		  $scope.colorHSV = function(size,Min,Max){

		  		if(size == "max")
		  		{
		  			var color = d3.hsl(0,1,0.5);
		  		} 
		  		else
		  		{
		  			var range = Max - Min; 
		  			var temp = size - Min;
		  			var alpha = temp/range ; 

		        	var hue = 240 * alpha ;
		        
		        	var color = d3.hsl(240-hue,1,0.5);
		  		}
		  		
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
		    console.log("HelloWatch thres", $scope.plotParameters.threshold);
		    $scope.thresholdValue();
		  });

		$scope.$watch("plotParameters.diameter", function(){
		    console.log("HelloWatch diam", $scope.plotParameters.diameter);
		    $scope.diameterValue();
		  });

		$scope.$watch("plotParameters.tension", function(){
		    console.log("HelloWatch tension", $scope.plotParameters.tension);
		    $scope.tensionValue();
		  });

		$scope.$watch("plotParameters.upperValue", function(){
		    console.log("HelloWatch upper", $scope.plotParameters.upperValue);
		    $scope.upperValue();
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
});
// angular.module('brainConnectivity').directive("replaceComma", function() {
// 	console.log("replace coma");
//     return {
//         restrict: "A",
//         link: function(scope, element) {
//             element.on("keydown", function(e) {
//                 if(e.keyCode === 188) {
//                     this.value += ".";
//                     e.preventDefault();
//                 }
//             });
//         }
//     };
// });
