angular.module('brainConnectivity')
.directive('circlePlot',function($routeParams,$location,probtrack){


	function link($scope,$attrs,$filter){

		$scope.plotParameters = {};
		$scope.plotParameters.threshold = 0;
		$scope.plotParameters.method = [true,false,false];
		$scope.plotParameters.diameter = 960;
		$scope.plotParameters.tension = 0.85;
		$scope.plotParameters.upperValue = 1;
		$scope.plotParameters.link1 = "";
		$scope.plotParameters.link2 = "";

    	$scope.choices = [{"id":"average", "value":"1", "label":"Average", "checked":true}, {"id":"max", "value":"2","label":"Maximum","checked":false},{"id":"min", "value":"3","label":"Minumum","checked":false}];
		 
		$scope.selectMethodMatrixProcess = function(){

			var method = $scope.plotParameters.method;
			console.log(method);
			var returnMethod;
			if(method[0] == true)
			{	
				returnMethod = "average";
			}
			else if ( method[1] == true )
			{
				returnMethod = "max";
			}
			else if( method[2] == true )
			{
				returnMethod = "min";
			}
			else if(method[0] == false && method[1] == false && method[2] == false)
			{	
				$scope.choices[0]["checked"]=true;
				$scope.plotParameters.method[0]=true;
				returnMethod = "average";

			}
			return returnMethod;
			};

		$scope.AverageMatrix = function(matrix){
			
			var MatrixProc = [];
			matrix.forEach(function(line,i){
				var row = [];
				line.forEach(function(val,j)
				{
					if(i==j)
					{
						row.push(0);
					}
					else if (j>i)
					{
						var average;
						average = ( matrix[i][j] + matrix[j][i] ) /2;
						row.push(average);
					}
					else
					{
						row.push(-1);
					}
				})
				MatrixProc.push(row);
				})
			return MatrixProc;
			}

		$scope.MaximumMatrix = function(matrix){

				var MatrixProc = [];
				matrix.forEach(function(line,i){
						var row = [];
						line.forEach(function(val,j)
							{
								if(i==j)
								{
									row.push(0);
								}
								else if (j>i)
								{
									var max;
									if(matrix[i][j] > matrix[j][i])
									{
										max = matrix[i][j];
									}
									else{
										max = matrix[j][i];
									}
									row.push(max);
								}
								else
								{
									row.push(-1);
								}
							})
							MatrixProc.push(row);
						})
					return MatrixProc;
		}

		$scope.MinimumMatrix = function(matrix){

				var MatrixProc = [];
				matrix.forEach(function(line,i){
						var row = [];
						line.forEach(function(val,j)
							{
								if(i==j)
								{
									row.push(0);
								}
								else if (j>i)
								{
									var max;
									if(matrix[i][j] < matrix[j][i])
									{
										max = matrix[i][j];
									}
									else{
										max = matrix[j][i];
									}
									row.push(max);
								}
								else
								{
									row.push(-1);
								}
							})
							MatrixProc.push(row);
						})
					return MatrixProc;
		}
		
		 $scope.CreateDescription = function(JSONInfo, checkbox){
				 if($scope.plotData)
		 		 {		 		 	
		 		 	console.log("valueCheck" + checkbox);
		 		 	var matrix = JSONInfo["matrix"];
		 		 	var MatProcess = [];
		 		 	//Process matrix 
		 		 	if(checkbox == "average")
		 		 	{
						MatProcess=$scope.AverageMatrix(matrix)
		 		 	}
		 		 	else if (checkbox == "max")
		 		 	{
		 		 		MatProcess=$scope.MaximumMatrix(matrix)
		 		 	}
		 		 	else
		 		 	{
		 		 		MatProcess=$scope.MinimumMatrix(matrix)
		 		 	}
		 			var seeds = JSONInfo["listOrdered"];
		 			var matrixDescription = [];
                
                	var sizeMat = seeds.length;
                	for (var nbseed = 0; nbseed<sizeMat; nbseed++)
                	{
                    	var jsonLine = {"name": seeds[nbseed] };
                    	var size = [];
                    	var imports = [];

                    	for (var j = 0; j<sizeMat; j++)
                    	{
                        	if(j != nbseed )
                        	{
                            	if(MatProcess[nbseed][j] > "0")
                            	{
                                	size.push(parseFloat(MatProcess[nbseed][j]));
                                	imports.push(seeds[j]);
                            	}
                        	}
                    	}
                    	jsonLine.size = size;
                    	jsonLine.imports = imports;
                    	matrixDescription.push(jsonLine);
               		 }
               		 
		 			return matrixDescription;
		 		}
		 }

		 $scope.MatrixProcess = function(){
    
		    if($scope.plotData){
		    	$scope.removeOldPlot();
		       	$scope.plotVisible = true  ;
		      	$scope.Plot();
		    }
		  }

		  $scope.Tooltip = function(){
    
		    if($scope.plotData){
		    	$scope.removeOldPlot();
		       	$scope.plotVisible = true  ;
		      	$scope.Plot();
		    }
		  }

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
		  	var circlePlot = document.getElementById("divPlot");
		  	circlePlot.parentNode.removeChild(circlePlot);
		  	var tooltipPlot = document.getElementById("tooltip");
		  	tooltipPlot.parentNode.removeChild(tooltipPlot);
		  	
		  }

		  $scope.Plot = function(){

		  	var method = $scope.selectMethodMatrixProcess();
		    var JSONInfo = $scope.plotData;
		    var classes = $scope.CreateDescription(JSONInfo,$scope.selectMethodMatrixProcess());
		    
		    var thresholdDefaultValue = $scope.plotParameters.threshold;
		    var diameter = $scope.plotParameters.diameter;

		    var tensionSplines = $scope.plotParameters.tension;
		    var upperValue = $scope.plotParameters.upperValue;

		    if(upperValue != 0)
		    {
		    	if(upperValue <= thresholdDefaultValue) alert("The maximum upper value should be superior to the threshold value");

		    }
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

		      var margin = {top: 30, right: 10, bottom: 15, left: 50},
		        width = 100 - margin.right - margin.left,
		        height = diameter;

		    var intDiameter = parseInt(diameter) + 50;
		    var diamMargin = intDiameter + 100;

		    var bottom = margin.bottom;
		    var newHeight = intDiameter +  bottom;

		    var divPlot = d3.select("body").append("div")
		     	.attr("width", diamMargin)
		        .attr("height", newHeight)
		        .attr("class", "divPlot")
		        .attr("id", "divPlot");;

		    var splines = [];    
		    var svg = d3.select(".divPlot").append("svg")
		         .attr("width", intDiameter )
		         .attr("height", newHeight)
		        .attr("class", "circlePlot")
		        .attr("id", "circlePlot")   
		        .append("g")
		        .attr("transform", "translate(" + radius + "," + radius + ")");
		  
		    var y = d3.scale.linear()
		        .range([height/2, 0])
		        .domain([thresholdDefaultValue, upperValue]);	     
		        

		    var svgColorbar = d3.select(".divPlot").append("svg")
		        .attr("width", 100)
		        .attr("height", newHeight+10)//+ margin.top + margin.bottom )
		        .attr("id", "colorBar")
		        .attr("class", "colorBar")
		      .append("g")
		        .attr("transform", "translate(" + margin.left + "," + newHeight/4 + ")");

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
		        .attr("width", width/1.5)
		        .attr("height", height/2)
		        .style("fill", "url(#gradient)");

		    svgColorbar.append("g")
		        .attr("class", "axis")
		        //.attr("transform", "translate(0," + height + ")")
		        .call(d3.svg.axis().scale(y).orient("left").ticks(10));


		     var nodes = cluster.nodes($scope.packageHierarchy(classes));
		      
		     //console.log(thresholdDefaultValue);
		     var links = $scope.packageImports(nodes,thresholdDefaultValue);
		     splines = bundle(links);
		     //console.log(splines);
		      var size = $scope.sizeMap(nodes,thresholdDefaultValue);

		      var sizeOfLinksRatio = diameter/35;

		      var MinMax = upperValue - thresholdDefaultValue; 
		      var invMinMax = 1 / MinMax


		      var valLink1=$scope.plotParameters.link1;
		      var valLink2=$scope.plotParameters.link2;
		      var path = svg.selectAll(".link")
		          .data(splines)
		          .enter()
		            .append("path")
		          .attr("class", "link")
		          .attr("stroke-width", function(d, i) { return (size[i]*sizeOfLinksRatio+MinMax) + "px"; })
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
		          		var sized = d.length;
		          		valLink1=d[0].key;
		          		valLink2=d[sized-1].key;
		          		var Text1 = document.getElementById(valLink1);
		          		var Text2 = document.getElementById(valLink2);
		          		Text1.setAttribute("font-weight", "bold");
		          		Text2.setAttribute("font-weight", "bold");
		          		Text1.setAttribute("font-size", "13px");
		          		Text2.setAttribute("font-size", "13px");
		          	
		                div.transition()    
		                    .duration(200)    
		                    .style("opacity", .9);    
		                div.html( "Connectivity value : " + size[i].toFixed(5) ) 
		                    .style("left", (d3.event.pageX) + "px")   
		                    .style("top", (d3.event.pageY + 28) + "px");  
		                })          
		            .on("mouseout", function(d) {   

		            	var sized = d.length;
		          		valLink1=d[0].key;
		          		valLink2=d[sized-1].key;
		          		var Text1 = document.getElementById(valLink1);
		          		var Text2 = document.getElementById(valLink2);
		          		Text1.setAttribute("font-weight", "normal");
		          		Text2.setAttribute("font-weight", "normal");
		          		Text1.setAttribute("font-size", "11px");
		          		Text2.setAttribute("font-size", "11px");

		                div.transition()    
		                    .duration(500)    
		                    .style("opacity", 0); 
		            })
		          ;
		          console.log("VALLINK2" + valLink2)

		       svg.selectAll(".node")
		          .data(nodes.filter(function(n) { 
		          	//if(n.parent["depth"]==1)
		          //console.log(n) ;
		          	return !n.children; }))
		        .enter().append("g")
		          .attr("class", "node")
		          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
		        .append("text")
		          .attr("id",function(d){ return d.key; })
		          .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
		          .attr("dy", ".31em")
		          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		          .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; }) 
		          //.attr("font-weight", "bold")      
		          .text(function(d) { 
		          	// if(d.key == "Precentral_L"){
		          	// 	d.attr("font-weight", "bold");
		          	// }
		          	return d.key; })
		          .attr("font-weight",function(d){
		          	if(d.key == valLink2 )
		          	{
		          		return "bold";
		          	}
		          else
		          {
		          	return "normal";
		          }
		          });


		      d3.select(self.frameElement).style("height", diameter + "px");  
 
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
		     // console.log(size);
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
  //console.log(classes);
  classes.forEach(function(d) {
    find(d.name, d);
  });

  return map[""];
}

// Return a list of imports for the given array of nodes.
$scope.packageImports = function (nodes, threshold) {
  var map = {},
      imports = [];
      //console.log(nodes);
  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) d.imports.forEach(function(i,r) {
    	//console.log(threshold);
      if(d.size[r]>threshold)  {
      	imports.push({source: map[d.name], target: map[i]});
      }
    });
  });
  //console.log(imports);
  return imports;
}

		$scope.$watch("plotParameters.link1", function(){
		    console.log("HelloWatch tooltip", $scope.plotParameters.link1);
		    $scope.Tooltip();
		  });

		$scope.$watch("plotParameters.link2", function(){
		    console.log("HelloWatch tooltip", $scope.plotParameters.link2);
		    $scope.Tooltip();
		  });


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

		//Checkboxes
		$scope.$watch("plotParameters.method[0]", function(){

		    if($scope.plotParameters.method[0]==true)
		    {
		    	$scope.choices[1]["checked"]=false;
		    	$scope.choices[2]["checked"]=false;
		    	$scope.plotParameters.method[1]=false;
		    	$scope.plotParameters.method[2]=false;
		    }
		    console.log("HelloWatch processvalue", $scope.plotParameters.method);
		    $scope.MatrixProcess();
		  });

		$scope.$watch("plotParameters.method[1]", function(){
		    
		    if($scope.plotParameters.method[1]==true)
		    {
		    	$scope.choices[0]["checked"]=false;
		    	$scope.choices[2]["checked"]=false;
		    	$scope.plotParameters.method[0]=false;
		    	$scope.plotParameters.method[2]=false;
		    }
		    console.log("HelloWatch processvalue", $scope.plotParameters.method);
		    $scope.MatrixProcess();
		  });

		$scope.$watch("plotParameters.method[2]", function(){
		     if($scope.plotParameters.method[2]==true)
		    {
		    	$scope.choices[0]["checked"]=false;
		    	$scope.choices[1]["checked"]=false;
		    	$scope.plotParameters.method[0]=false;
		    	$scope.plotParameters.method[1]=false;
		    }
		    $scope.MatrixProcess();
		    console.log("HelloWatch processvalue", $scope.plotParameters.method);
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
