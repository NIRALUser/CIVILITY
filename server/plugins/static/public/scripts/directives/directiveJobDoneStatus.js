angular.module('brainConnectivity')
.directive('jobDoneStatus', function($routeParams,$location,clusterpost, probtrack){

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

    $scope.selectJobDonePCA = false;
    $scope.test = [];

		$scope.plotData = undefined;

     $scope.viewLogOutput = false;
    $scope.viewLogErrorOutput = false;

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

/*  		$scope.getOutputDirectory = function(){

  			console.log($scope.jobObject);
			//clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[2].name + ".tar.gz","blob").then(function(res){
				clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[2].name + ".tar.gz","blob").then(function(res){
					 console.log(res);

					var a = document.createElement("a");
			        document.body.appendChild(a);
			        a.style = "display: none";
			        var url = window.URL.createObjectURL(res.data);
			        a.href = url;
			        a.download = $scope.jobObject.outputs[2].name + "tar.gz";
			        a.click();
			        console.log("DOWNLOAD FILE")
			        window.URL.revokeObjectURL(url);
			        document.body.removeChild(a);

				})
				.catch(function(e){
      				console.log(e);
    			});


  		}*/

		$scope.getJob = function(){

				console.log("Get job");
				clusterpost.getJob($scope.jobId).then(function(res){
					console.log(res);
					$scope.getJobRequest = true;
					$scope.jobInfo = res;
					$scope.paramInfo();

				})

		}

    $scope.getOutputLogFile = function(){

      clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[3].name,"text").then(function(res){
           console.log(res.data);
           var str = res.data;
           $scope.logFile = str.split("\n");
        })
        .catch(function(e){
            console.error("Error getting log file", e);
            throw e;
          });
    }

     $scope.hideOutputLogFile = function(){
        $scope.viewLogOutput = false;
    }
    
    $scope.getOutputErrorLogFile = function(){
      clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[4].name,"text").then(function(res){
           console.log(res.data);
           var str = res.data;
           $scope.logErrorFile = str.split("\n");
        })
        .catch(function(e){
            console.error("Error getting log error file", e);
            throw e;
          });
    }
    $scope.hideOutputErrorLogFile = function(){
        $scope.viewLogErrorOutput = false;
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
					$scope.jobStatus = res.data.status;
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
    $scope.getParcellationTable = function(){ 
      return clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[1].name,"json").then(function(res){
        return res.data;
      })
      .catch(function(e){
            console.error("Error getting parcellationTable", e);
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

  //Check list and update checkbox value according to the list 
  $scope.updateCheckboxWithList = function(){

    console.log($scope.listPca);
    var cpt = 0;
    _.each($scope.listPca, function(val,i){
      if(val.id != $scope.jobId)
      {
        cpt++;
      }
      else
      {
        //Id found in list 
      }
    })

      if($scope.listPca.length == cpt)
      {
        $scope.selectJobPCA = false;
      }
      else
      {
        $scope.selectJobPCA = true;
      }
  }

  //List of jobs to compute PCA -- add or delete 
  $scope.listJobsSelectPCA = function(){


    if($scope.selectJobPCA == true){

      var param = {
        id : "",
        subject : "",
        type : "job",
        matrix : "",
        parcellationTable : ""
      };

      param.id = $scope.jobId;
      param.subject = $scope.jobObject.parameters[0].name;
      $scope.getMatrix().then(function(res){
        param.matrix=res;
      });
      $scope.getParcellationTable().then(function(res){
        param.parcellationTable=res;
      });
      console.log($scope.listPca);
      var inList = false;

      //Check if it's not already in the list 
      _.each($scope.listPca, function(val,i){
        if(val.id == $scope.jobId)
        {
          inList = true;
        }
      })
      if( inList != true) {
        $scope.listPca.push(param);
        }  
    }
    else{
        $scope.listPca.forEach(function(job,i){
        if(job.id == $scope.jobId)
        {
          //Delete job from list if selected before
         $scope.listPca.splice( i, 1 );
        }
      })
    }
  }

  $scope.$watchCollection("listPca", function(){
        console.log("HelloWatch listPca", $scope.listPca);
        $scope.updateCheckboxWithList();
      });
  $scope.$watch("selectJobPCA", function(){
        console.log("HelloWatch selectJobDonePCA", $scope.selectJobPCA);
        $scope.listJobsSelectPCA();
      });
	}
	return {
    restrict : 'E',
    scope: {
    	jobId : "=",
      listPca : "="
    },
    link : link,
    templateUrl: 'views/directives/directiveJobDoneStatus.html'



  }
});