angular.module('brainConnectivity')
.directive('jobAllStatus', function($routeParams,$location,clusterpost, probtrack){

	function link($scope,$attrs,$filter){

		$scope.getStatusRequest = false;
		$scope.getJobRequest = false;
		$scope.jobKill = false;
     $scope.jobDelete = false;


		$scope.jobDone = false;
		$scope.jobCancel = false;
		$scope.plotOnce = false;

		$scope.matrixOut = "";
		$scope.tableDescription = {};
		$scope.jobObject = {};

		$scope.plotData = undefined;

		$scope.getJobObject = function(){

			clusterpost.getJob($scope.jobId).then(function(res){
				console.log(res);
				$scope.jobObject = res.data;
			})
			 .catch(function(e){
		      console.log(e);
		    });

		}

		$scope.getJobObject();

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

  			console.log($scope.jobObject);
			//clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[2].name + ".tar.gz","blob").then(function(res){
				clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[2].name + ".tar.gz","blob").then(function(res){
					 console.log(res);

					var a = document.createElement("a");
			        document.body.appendChild(a);
			        a.style = "display: none";
			        var url = window.URL.createObjectURL(res.data);
			        a.href = url;
			        a.download = $scope.jobObject.outputs[2].name;
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
				.catch(function(e){
      			console.log(e);
    		});
		}
		$scope.getStatus();
		$scope.killJob = function(){
			console.log("KillJob");
			clusterpost.killJob($scope.jobId).then(function(res){
        	console.log("Job " + $scope.jobId + " is killed");
        	$scope.jobKill = true;

       		})

		}
    $scope.deleteJob = function(){
      console.log("DeleteJob");
      clusterpost.deleteJob($scope.jobId).then(function(res){
          console.log("Job " + $scope.jobId + " is delete ");
          $scope.jobDelete = true;

          })

    }

		$scope.submit = function(){

		    probtrack.getFDTMatrix("helloOParam1")
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
        $scope.viewCirclePlot = false;
  		  }
		
		$scope.getTableDescription = function(){
			return clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[1].name,"json").then(function(res){				
				return res.data;
			})
			.catch(function(e){
      			console.error("Error getting parcellation description table", e);
      			throw e;
    		});    		
		}

		$scope.getMatrix = function(){ 
			return clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[0].name,"text").then(function(res){
				return res.data;
			})
			.catch(function(e){
      			console.error("Error getting matrix", e);
      			throw e;
    		});
		}

    $scope.plotVisu = function(){
      $scope.plotDataCircle();
      $scope.plotDataCircle();
    }

		$scope.plotDataCircle = function(){

      $scope.viewCirclePlot = true;

			var promarray = [
				$scope.getMatrix(),
				$scope.getTableDescription()
			];

			Promise.all(promarray)
			.then(function(res){
				$scope.matrixOut = res[0];
				$scope.tableDescription = res[1];

				console.log($scope.matrixOut, $scope.tableDescription);

				$scope.plotBrainConnectivityJobDone();
			})
			.catch(function(e){
				console.error(e);
			});
		}

    $scope.isDone = function(){
      if($scope.jobStatus == "DONE")
      {
        $scope.jobDone = true;
      }
    }

		 $scope.plotBrainConnectivityJobDone = function(){

     var data = $scope.matrixOut ;
  	
  	 var table =  $scope.tableDescription;
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
                    listFDT[matrixRow-1] = AALObject[seed]["VisuHierarchy"] + AALObject[seed]["name"];
                    var visuorder = AALObject[seed]["VisuOrder"];
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
                for(var i=0 ; i < MaxvisuOrder ; i++)
                {
                  listVisuOrder.push("");
                }
                for ( var seed in table_Matrix)
                {
                  
                  var visuOrder = table_Matrix[seed]["VisuOrder"];
                  if(visuOrder != "-1")
                  {
                    var name = table_Matrix[seed]["VisuHierarchy"] + table_Matrix[seed]["name"];
                    if(table_Matrix[seed]["coord"] != undefined)
                    {
                      var coordX = table_Matrix[seed]["coord"][0];
                      var coordY = table_Matrix[seed]["coord"][1];
                      var coordZ = table_Matrix[seed]["coord"][2];
                      var seedInfo = {"name" : name,  "x": coordX, "y": coordY, "z": coordZ};

                    }
                    else 
                    {
                      var seedInfo = {"name" : name};
                    }
                    listVisuOrder[visuOrder-1] = seedInfo;
                  } 
                  else
                  {
                    //Don't use
                  }  
                }

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
            $scope.plotParameters.diameter = 960;
            $scope.plotParameters.upperValue = 1;
            $scope.plotParameters.data = returnJSONobject;
            $scope.NewPlot;
    }


    $scope.$watch("jobStatus", function(){
        console.log("HelloWatch jobStatus", $scope.jobStatus);
        $scope.isDone();
      });
	}
	return {
    restrict : 'E',
    scope: {
    	jobId : "=",
    },
    link : link,
    templateUrl: 'views/directives/directiveJobAllStatus.html'



  }
});