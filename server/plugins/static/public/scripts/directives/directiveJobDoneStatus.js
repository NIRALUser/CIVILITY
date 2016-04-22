angular.module('brainConnectivity')
.directive('jobDoneStatus', function($routeParams,$location,clusterpost, probtrack){

	function link($scope,$attrs,$filter){

		$scope.getJobRequest = false;
    $scope.jobDelete = false;
		$scope.jobObject = {};
    $scope.selectJobDonePCA = false;
    $scope.viewLogOutput = false;
    $scope.viewLogErrorOutput = false;
    $scope.viewCirclePlot = false;
    console.log("lsit pca",$scope.listPca);
    if(Array.isArray($scope.listPca))
    {
      $scope.computePCA = true;
    }
    else
    {
      $scope.computePCA = false;
    }

    //get job object 
		$scope.getJobObject = function(){
			clusterpost.getJob($scope.jobId).then(function(res){
				$scope.jobObject = res.data;
			})
			 .catch(function(e){
		      console.error(e);
          throw e;
		    });
		}
		$scope.getJobObject();

		$scope.reRunJob = function(){
			
      //Submit job 
		  clusterpost.submitJob($scope.jobId).then(function(res){
		        console.log("Job " + $scope.jobId + " submit");
		    })
		    .catch(function(e){
		      console.error(e);
          throw e;
		    });
		};
  	
    //Check parameters
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
  	};

		//Get job document information 
    $scope.getJobInfo = function(){
			$scope.getJobRequest = true;
			$scope.paramInfo();
		};
    //Hide job document information 
    $scope.hideJobInfo = function()
    {
      $scope.getJobRequest = false;
    };

    //Get output log file
    $scope.getOutputLogFile = function(){
      clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[3].name,"text").then(function(res){
        var str = res.data;
        $scope.logFile = str.split("\n");
        })
      .catch(function(e){
        console.error("Error getting log file", e);
        throw e;
      });
    };
    //Hide output log file
   $scope.hideOutputLogFile = function(){
        $scope.viewLogOutput = false;
    };
    //Get output error log file
    $scope.getOutputErrorLogFile = function(){
      clusterpost.getAttachment($scope.jobId,$scope.jobObject.outputs[4].name,"text").then(function(res){
           var str = res.data;
           $scope.logErrorFile = str.split("\n");
        })
        .catch(function(e){
            console.error("Error getting log error file", e);
            throw e;
          });
    };
    //Hide output error log file
    $scope.hideOutputErrorLogFile = function(){
        $scope.viewLogErrorOutput = false;
    };

    //Delete job document and data 
    $scope.deleteJob = function(){
      console.log("DeleteJob");
      clusterpost.deleteJob($scope.jobId).then(function(res){
          console.log("Job " + $scope.jobId + " is delete ");
          $scope.jobDelete = true;
      });
    };

    //Remove circle plot 
		$scope.removeCirclePlot = function(){
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
        throw e;
			});      
		}

		$scope.plotBrainConnectivityJobDone = function(matrix,tableDescription){      
      
      $scope.viewCirclePlot = true;
      var data = matrix  	
    	var table = tableDescription;
    
      var lines = data.split('\n');

      //GET MATRIX  
      console.log("DEBUT");  
      var matrix = [];
      for(var line = 0; line < lines.length; line++)
      {      
        var rows = [];
        var values = lines[line].split('  ');
        for(var val = 0; val < values.length; val++)
        {
          if(values[val] != "")
          {
            rows.push(values[val]);
          }           
        }
        if(rows.length>0)
        {
          matrix.push(rows);
        }
      }    
      
      for(var mat in matrix)
      {
        if(matrix.length != matrix[mat].length)
        {
          console.log("Error dimension matrix");
        }
      }
      //Matrix Normalization  
      var matrix_norm = [];
      var waytotal = [];
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
      var table_Matrix = [];
      var listFDT = [];
      var listVisuOrder = [];
      var coordList = {};
      var MaxvisuOrder = 0;

      for(var i=0 ; i < matrix.length ; i++)
      {
        listFDT.push({});
      }

      for ( var seed in table)
      {
        var matrixRow = table[seed]["MatrixRow"];
        if(matrixRow != "-1")
        {
          listFDT[matrixRow-1] = table[seed]["VisuHierarchy"] + table[seed]["name"];
          var visuorder = table[seed]["VisuOrder"];
          if(visuorder > MaxvisuOrder )
          {
            MaxvisuOrder = visuorder;
          }
            table_Matrix.push(table[seed]);
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
      matrix_norm.forEach(function(line,i){
        var indexLine = listFDT.indexOf(listVisuOrder[i]["name"])  //1
        if(indexLine != -1)
        {
          var row=matrix_norm[indexLine];
          var NewRow =[];
          row.forEach(function(val,j){
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
      console.log("FIN");  
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
  };

  //Check list and update checkbox value according to the list 
  $scope.updateCheckboxWithList = function(){
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
    });
    if($scope.listPca.length == cpt)
    {
      $scope.selectJobPCA = false;
    }
    else
    {
      $scope.selectJobPCA = true;
    }
  };

  //List of jobs to compute PCA -- add or delete 
  $scope.listJobsSelectPCA = function(){
    if($scope.selectJobPCA == true)
    {

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
      var inList = false;

      //Check if it's not already in the list 
      _.each($scope.listPca, function(val,i){
        if(val.id == $scope.jobId)
        {
          inList = true;
        }
      });
      if( inList != true) {
        $scope.listPca.push(param);
        }  
    }
    else
    {
      $scope.listPca.forEach(function(job,i){
        if(job.id == $scope.jobId)
        {
          //Delete job from list if selected before
          $scope.listPca.splice( i, 1 );
        }
      });
    }
  };


  //Watch variables
    $scope.$watchCollection("listPca", function(){
      console.log("HelloWatch listPca", $scope.listPca);
      if ($scope.listPca != false) $scope.updateCheckboxWithList();
    });
    $scope.$watch("selectJobPCA", function(){
      console.log("HelloWatch selectJobDonePCA", $scope.selectJobPCA);
      if ($scope.listPca != false) $scope.listJobsSelectPCA();
    });
    $scope.$watch("viewCirclePlot", function(){
     console.log("HelloWatch viewCirclePlot", $scope.viewCirclePlot);
    });
	}
	return {
    restrict : 'E',
    scope: {
    	jobId : "=",  // id of the job
      listPca : "="  //list job selected for compute PCA
    },
    link : link,
    templateUrl: 'views/directives/directiveJobDoneStatus.html'
  }
});