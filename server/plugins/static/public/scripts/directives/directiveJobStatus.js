angular.module('brainConnectivity')
.directive('jobStatus', function($routeParams,$location,clusterpost, probtrack){

	function link($scope,$attrs,$filter){

		$scope.getJobRequest = false;
    $scope.jobDelete = false;
		$scope.jobObject = {};
    $scope.selectJobDonePCA = false;
    $scope.viewLogOutput = false;
    $scope.viewLogErrorOutput = false;
    $scope.viewCirclePlot = false;
    $scope.selection = {};
    $scope.selection.jobSelect = false; 
   // $scope.selectJob = false;
    
    //get job object 
    $scope.getJobObject = function(){
      clusterpost.getJob($scope.jobId).then(function(res){
        $scope.jobObject = res.data;
        console.log($scope.jobObject);
        if($scope.jobObject.jobstatus.status == "DONE")
        {
          $scope.jobDone = true;
        }
        else
        {
          $scope.jobDone = false;
        }
      })
       .catch(function(e){
          console.error(e);
          throw e;
        });
    }
    $scope.getJobObject();

    if(Array.isArray($scope.listPca))
    {
      $scope.computePCA = true;
    }
    else
    {
      $scope.computePCA = false;
    }

    $scope.change = function(){

    }

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
        $scope.jsonObjectForPlotConnectivity = {
          "fdt_matrix" : matrixOut,
          "jsonTableDescripton" : tableDescription
        }
        $scope.viewCirclePlot = true;
        $scope.ButtonClicked = true;
        $scope.plotParameters = {};
        $scope.plotParameters.link1 = "";
        $scope.plotParameters.link2 = "";
        $scope.plotParameters.threshold = 0.1;
        $scope.plotParameters.tension = 85;
        $scope.plotParameters.diameter = 960;
        $scope.plotParameters.upperValue = 1;
        $scope.plotParameters.data = $scope.jsonObjectForPlotConnectivity;
        $scope.$apply();
			})
			.catch(function(e){
				console.error(e);
        throw e;
			});      
		}

  //Check list and update checkbox value according to the list 
  $scope.updateCheckboxWithList = function(){

    var cpt = 0;
    _.each($scope.listPca, function(val,i){
      if(val.type == "job")
      {
        if(val.id == $scope.jobId)
        {
          cpt++;
          $scope.selection.jobSelect = true;
        }
      }
    });
    if(cpt == 0 )
    {
        $scope.selection.jobSelect = false;
    }
  };

  //List of jobs to compute PCA -- add or delete 
  $scope.listJobsSelectPCA = function(){
    
    if($scope.selection.jobSelect == true)
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
      if ($scope.listPca != "none") $scope.updateCheckboxWithList();
    });
    $scope.$watch("selection.jobSelect", function(){
      console.log("HelloWatch selection.jobSelect", $scope.selection.jobSelect);
      if ($scope.listPca != "none") $scope.listJobsSelectPCA();
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
    templateUrl: 'views/directives/directiveJobStatus.html'
  }
});