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

		$scope.jobObject = {};

		$scope.plotData = undefined;

    $scope.viewLogOutput = false;
    $scope.viewLogErrorOutput = false;
    $scope.viewCirclePlot = false;


		$scope.getJobObject = function(){
			clusterpost.getJob($scope.jobId).then(function(res){
			   $scope.jobObject = res.data;
			})
		  .catch(function(e){
        console.error("getJob failed",e);
        throw e;
		  });
		};
		$scope.getJobObject();

		$scope.getOutputLogFile = function(){

      clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[3].name,"text").then(function(res){
           var str = res.data;
           $scope.logFile = str.split("\n");
           $scope.viewLogOutput = true;
        })
        .catch(function(e){
            console.error("Error getting log file", e);
            throw e;
          });
		};
    $scope.hideOutputLogFile = function(){
        $scope.viewLogOutput = false;
    };

		$scope.getOutputErrorLogFile = function(){
      clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[4].name,"text").then(function(res){
           var str = res.data;
           $scope.logErrorFile = str.split("\n");
           $scope.viewLogErrorOutput = true;
        })
        .catch(function(e){
            console.error("Error getting log error file", e);
            throw e;
          });
		};
    $scope.hideOutputErrorLogFile = function(){
        $scope.viewLogErrorOutput = false;
    };

		$scope.reRunJob = function(){
			    //Submit job 
		    clusterpost.submitJob($scope.jobId).then(function(res){
		        console.log("Job " + $scope.jobId + " submit");
		        $scope.jobKill = false;
		    })
		    .catch(function(e){
		      console.error("submit job failed", e);
            throw e;
		    });
		}


  		$scope.paramInfo = function(){
  			if($scope.jobObject.parameters[8].name == "true")
  			{
  				$scope.ignoreLabelSet=true;
  			}
  			else
  			{
  				$scope.ignoreLabelSet=false;
  			}

  			if($scope.jobObject.parameters[5].name == $scope.jobObject.parameters[6].name)
	    	{
	    		$scope.sameSurface= true;
	    	}
	    	else
	    	{
	    		$scope.sameSurface= false;
	    	}

  		}
		$scope.getJob = function(){
					$scope.getJobRequest = true;
					$scope.paramInfo();
		};


		$scope.hideJobInfo = function()
		{
			$scope.getJobRequest = false;
		}

		$scope.getStatus = function(){
			clusterpost.getJobStatus($scope.jobId).then(function(res){
					$scope.jobStatus = res.data.status;
					$scope.getStatusRequest = true;
					if($scope.jobStatus == "DONE")
					{
						$scope.jobDone = true;
						//Should print circle connectivity (directives)
					}
					else if ($scope.jobStatus == "FAILED" || $scope.jobStatus == "KILL")
					{
						$scope.jobKill = true;
						//Ask to user if he want's to re-run the job 
						//	Recontruct job object and submit once again
					}
				})
				.catch(function(e){
      			console.error("error get job status", e);
            throw e;
    		});
		}
		$scope.getStatus();
		$scope.killJob = function(){
			clusterpost.killJob($scope.jobId).then(function(res){
        	console.log("Job " + $scope.jobId + " is killed");
        	$scope.jobKill = true;
       		});
		};
    $scope.deleteJob = function(){
      clusterpost.deleteJob($scope.jobId).then(function(res){
          console.log("Job " + $scope.jobId + " is delete ");
          $scope.jobDelete = true;
          });
    };

		$scope.removeOld = function(){
		  	console.log("REMOVE OLD PLOT JOB");
		  	var circlePlot = document.getElementById("divPlot_"+$scope.plotID);
		  	if(circlePlot != null) 	circlePlot.parentNode.removeChild(circlePlot);
		  	var tooltipPlot = document.getElementById("tooltip_"+$scope.plotID);
		  	if(tooltipPlot != null) tooltipPlot.parentNode.removeChild(tooltipPlot);
		  	var tooltipNode = document.getElementById("nodeTooltip_"+$scope.plotID);
		  	if(tooltipNode != null) tooltipNode.parentNode.removeChild(tooltipNode);
        $scope.viewCirclePlot = false;
  	};
		
		//Get parcellation table (json file)
    $scope.getParcellationTable = function(){ 
      return clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[1].name,"json").then(function(res){
        return res.data;
      })
      .catch(function(e){
            console.error("Error getting parcellationTable", e);
            throw e;
      });
    };
    //Get matrix - output of probtrackx2
    $scope.getMatrix = function(){ 
      return clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[0].name,"text").then(function(res){
        return res.data;
      })
      .catch(function(e){
            console.error("Error getting matrix", e);
            throw e;
      });
    };

		$scope.plotDataCircle = function(){
      var promarray = [
        $scope.getMatrix(),
        $scope.getParcellationTable()
      ];

      Promise.all(promarray)
      .then(function(res){
        var matrixOut = res[0];
        var tableDescription = res[1];
        console.log(matrixOut, tableDescription);
        $scope.plotBrainConnectivityJobDone(matrixOut,tableDescription);
      })
      .catch(function(e){
        console.error(e);
        throw e ;
      });      
    }

    $scope.isDone = function(){
      if($scope.jobStatus == "DONE")
      {
        $scope.jobDone = true;
      }
    }

		 $scope.plotBrainConnectivityJobDone = function(matrix,tableDescription){    
       $scope.viewCirclePlot = true;
      var data = matrix
  	 var table = tableDescription;
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
            
            var returnJSONobject = {"matrix" : NewMat, "listOrdered" : listVisuOrder}

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
            $scope.$apply();
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