angular.module('brainConnectivity')
.directive('jobStatus', function($routeParams,$location,clusterpost, probtrack){

	function link($scope,$attrs,$filter){

		$scope.getStatusRequest = false;
		$scope.getJobRequest = false;
		$scope.jobKill = false;

		$scope.jobDone = false;
		$scope.jobCancel = false;
		$scope.plotCircle = false;
		$scope.plotOnce = false;

		$scope.matrixOut = "";
		$scope.tableDescription = {};

		console.log("Job id :", $scope.jobId);


		$scope.getOutput = function(){

		}
		$scope.getOutputError = function(){

		}

		$scope.reRunJob = function(){

			    //Submit job 
		    clusterpost.submitJob($scope.jobId).then(function(res){
		        console.log("Job " + $scope.jobId + " submit");
		        $scope.jobKill = false;
		    })
		    .catch(function(e){
		      console.log(e);
		    });
		}


  		$scope.paramInfo = function(){
  			if($scope.jobInfo.data.parameters[8].name == "true")
  			{
  				console.log("IgnoreLABEL");
  				$scope.ignoreLabelSet=true;
  			}
  			else
  			{
  				console.log("No label ignored")
  				$scope.ignoreLabelSet=false;
  			}
  			console.log($scope.jobInfo.data.parameters[5].name);
  			console.log($scope.jobInfo.data.parameters[6].name);

  			if($scope.jobInfo.data.parameters[5].name == $scope.jobInfo.data.parameters[6].name)
	    	{
	    		console.log("Same surface");
	    		$scope.sameSurface= true;
	    	}
	    	else
	    	{
	    		console.log("Not same surface");
	    		$scope.sameSurface= false;
	    	}

  		}

  		$scope.getOutputDirectory = function(){

  			console.log("Get data");

				clusterpost.getAttachment($scope.jobId,"neonate","blob").then(function(res){
					 console.log(res);

					var a = document.createElement("a");
			        document.body.appendChild(a);
			        a.style = "display: none";
			        var url = window.URL.createObjectURL(res.data);
			        a.href = url;
			        a.download = "neonate";
			        a.click();
			        console.log("DOWNLOAD FILE")
			        window.URL.revokeObjectURL(url);
			        document.body.removeChild(a);

				})
				.catch(function(e){
      				console.log(e);
    			});


  		}

		$scope.getJob = function(){

				console.log("Get job");
				clusterpost.getJob($scope.jobId).then(function(res){
					console.log(res);
					$scope.getJobRequest = true;
					$scope.jobInfo = res;
					$scope.paramInfo();

				})

		}


		$scope.hideJobInfo = function()
		{
			$scope.getJobRequest = false;
		}

		$scope.getStatus = function(){

			console.log("Get status");
			/*clusterpost.getJobStatus(id).then(function(res){
				console.log("Status : ",res);
				$scope.getStatusRequest = true;
			})*/
			clusterpost.getJobStatus($scope.jobId).then(function(res){
					console.log(res);
					console.log(res.data);
					var response = res.data;
					/*var resParse = JSON.parse(response);
					console.log(resParse);*/
					$scope.jobStatus = res.data.status;
					//$scope.jobStatus = "DONE";
					$scope.getStatusRequest = true;
					if($scope.jobStatus == "DONE")
					{
						console.log("Job is done");
						$scope.jobDone = true;
						//Should print circle connectivity (directives)
					}
					else if ($scope.jobStatus == "FAILED" || $scope.jobStatus == "KILL")
					{
						console.log("Job failed");
						$scope.jobKill = true;
						//Ask to user if he want's to re-run the job 
						//	Recontruct job object and submit once again
					}
				})
		}
		$scope.getStatus();
		$scope.killJob = function(){
			console.log("KillJob");
			clusterpost.killJob($scope.jobId).then(function(res){
        	console.log("Job " + $scope.jobId + " is killed");
        	$scope.jobKill = true;

       		})

		}
		$scope.submit = function(){

		    probtrack.getFDTMatrix()
		    .then(function(response){

		      $scope.ButtonClicked = true;
		      $scope.plotParameters = {};
		      $scope.plotParameters.link1 = "";
		      $scope.plotParameters.link2 = "";
		      $scope.plotParameters.threshold = 0.1;
		      $scope.plotParameters.method = [true,false,false];
		      $scope.plotParameters.tension = 85;
		      $scope.plotParameters.diameter = 960
		      $scope.plotParameters.upperValue = 1;
		      $scope.plotParameters.data = response.data;
		      $scope.Plot;
		    }).catch(function(e){
		    	console.log(e);
		    });

		  }

		 $scope.removeOld = function()
		  {
		  	console.log("REMOVE OLD PLOT JOB");
		  	var circlePlot = document.getElementById("divPlot_"+$scope.plotID);
		  	if(circlePlot != null) 	circlePlot.parentNode.removeChild(circlePlot);
		  	var tooltipPlot = document.getElementById("tooltip_"+$scope.plotID);
		  	if(tooltipPlot != null) tooltipPlot.parentNode.removeChild(tooltipPlot);
		  	var tooltipNode = document.getElementById("nodeTooltip_"+$scope.plotID);
		  	if(tooltipNode != null) tooltipNode.parentNode.removeChild(tooltipNode);
		  	$scope.plotCircle = false;

  		  }
		
		$scope.connectivityVisualisation = function(){
				if (!$scope.plotOnce)
				{
					 $scope.submit();
					 $scope.plotOnce = true;
				}
				$scope.plotCircle = true;
			
		}

		$scope.getTableDescription = function(){

			console.log("Get data");
			clusterpost.getAttachment($scope.jobId,"neonate/TABLE_AAL.json","json").then(function(res){
				console.log(res);
				$scope.tableDescription = res.data;
				console.log($scope.tableDescription);
			})
			.catch(function(e){
      			console.log(e);
    		});
		}

		$scope.getMatrix = function(){

			console.log("Get data");
			clusterpost.getAttachment($scope.jobId,"neonate/Network_overlapping_loopcheck/fdt_network_matrix","text").then(function(res){
				console.log(res);
				$scope.matrixOut = res.data;
				console.log($scope.matrixOut);

			})
			.catch(function(e){
      			console.log(e);
    		});
		}

		$scope.plotDataCircle = function(){

			$scope.getMatrix();
			$scope.getTableDescription();

			$scope.plotBrainConnectivityJobDone();



		}


		 $scope.plotBrainConnectivityJobDone = function(){

/*      $scope.nbPlot = $scope.nbPlot +1;
      $scope.plots.push($scope.nbPlot)*/

     var data = $scope.matrixOut ;
     console.log(data);
  		
  	 var table =  $scope.tableDescription ;
     console.log(table);

     console.log(data);

      var lines = data.split('\n');

       //GET MATRIX    
       var matrix = [];
        for(var line = 0; line < lines.length; line++){      
        // console.log(lines[line]);
            var rows = [];
            var values = lines[line].split('  ');
            for(var val = 0; val < values.length; val++){
              if(values[val] != ""){
                  //console.log(values[val]);
                   rows.push(values[val]);
                }           
              }
              if(rows.length>0)
              {
                  matrix.push(rows);
              }
            }

            for(var blabla in matrix)
             {
               //console.log(matrix[blabla]);
               if(matrix.length != matrix[blabla].length)
               {
                  console.log("Error dimension matrix");
               }
             }

                 var matrix_norm = [];
                 var waytotal = [];
                 //Matrix Normalization  
                 for(var i in matrix)
                 {
                    var sum = 0.0;
                    for(var j in matrix[i])
                    {
                        sum = sum + parseFloat(matrix[i][j]);
                    }
                    waytotal.push(sum);
                 }

                 for(var i in matrix)
                 {
                    var vals = [];
                    for(var j in matrix[i])
                    {
                        vals.push(parseFloat(matrix[i][j])/waytotal[i]);
                    }
                    matrix_norm.push(vals);
                 }

               

                var AALObject = table;
                //console.log(AALObject);

                var table_Matrix = [];
                var listFDT = [];
                var listVisuOrder = [];
                var coordList = {};
                var MaxvisuOrder = 0;

                for(var i=0 ; i < matrix.length ; i++)
                {
                  listFDT.push({});
                }

                for ( var seed in AALObject)
                {
                  var matrixRow = AALObject[seed]["MatrixRow"];
                  if(matrixRow != "-1")
                  {
                    //console.log(AALObject[seed]["MatrixRow"]);
                    listFDT[matrixRow-1] = AALObject[seed]["VisuHierarchy"] + AALObject[seed]["name"];
                    var visuorder = AALObject[seed]["VisuOrder"];
                    //console.log(visuorder);
                    if(visuorder > MaxvisuOrder )
                    {
                      MaxvisuOrder = visuorder;
                    }
                    table_Matrix.push(AALObject[seed]);
                  }
                  else
                  {
                    //Don't use
                  }
                  
                }
                console.log(MaxvisuOrder);

                for(var i=0 ; i < MaxvisuOrder ; i++)
                {
                  listVisuOrder.push("");
                }
                for ( var seed in table_Matrix)
                {
                  
                  var visuOrder = table_Matrix[seed]["VisuOrder"];
                  if(visuOrder != "-1")
                  {
                    //console.log("hello");
                    var name = table_Matrix[seed]["VisuHierarchy"] + table_Matrix[seed]["name"];
                    console.log("test value ", table_Matrix[seed]["coord"])
                    if(table_Matrix[seed]["coord"] != undefined)
                    {
                      console.log("TEST");
                      var coordX = table_Matrix[seed]["coord"][0];
                      var coordY = table_Matrix[seed]["coord"][1];
                      var coordZ = table_Matrix[seed]["coord"][2];
                      var seedInfo = {"name" : name,  "x": coordX, "y": coordY, "z": coordZ};

                    }
                    else 
                    {
                      var seedInfo = {"name" : name};
                    }
                    listVisuOrder[visuOrder-1] = seedInfo
                    //listVisuOrder[visuOrder-1]=table_Matrix[seed]["VisuHierarchy"] + table_Matrix[seed]["name"];
                  } 
                  else
                  {
                    //Don't use
                  }  
                }

                //console.log("List visu order" + listVisuOrder);
                //console.log("List fdt" + listFDT);

                var NewMat = [];
                matrix_norm.forEach(function(line,i)
                {
                var indexLine = listFDT.indexOf(listVisuOrder[i]["name"])  //1
                if(indexLine != -1)
                {
                  var row=matrix_norm[indexLine];
                  var NewRow =[];
                  row.forEach(function(val,j)
                  {
                    var indexRow = listFDT.indexOf(listVisuOrder[j]["name"]);
                    if(indexRow  != -1)
                    {
                      NewRow.push(row[indexRow]);
                    }      
                  });
                  NewMat.push(NewRow); 
                }                       
             });
            
            console.log("Matrix ordered");
            console.log(NewMat.length);

            var returnJSONobject = {"matrix" : NewMat, "listOrdered" : listVisuOrder}
            console.log(listVisuOrder);
            console.log(returnJSONobject);

            $scope.ButtonClicked = true;
            $scope.plotParameters = {};
            $scope.plotParameters.link1 = "";
            $scope.plotParameters.link2 = "";
            $scope.plotParameters.threshold = 0.1;
            $scope.plotParameters.method = [true,false,false];
            $scope.plotParameters.tension = 85;
            $scope.plotParameters.diameter = 960
            $scope.plotParameters.upperValue = 1;
            $scope.plotParameters.data = returnJSONobject;
            
            $scope.Plot;
   

  }
	}
	return {
    restrict : 'E',
    scope: {
    	jobId : "="
    },
    link : link,
    templateUrl: 'views/directives/directiveJobStatus.html'



  }
});