angular.module('CIVILITY')
.directive('jobStatus', function($routeParams,$location,clusterpost, $http){

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


   
    $scope.updateStatus = function(){
         clusterpost.getJobStatus($scope.jobId).then(function(res2){
           $scope.jobObject.jobstatus.status = res2.data.status ; 
        })
        .catch(function(e){
          console.error(e);
          throw e;
        });
    }
    
    //get job object  and update status
    $scope.getJobObject = function(){
      clusterpost.getJob($scope.jobId).then(function(res){
        $scope.jobObject = res.data;
        $scope.jobObject.timestamp = new Date($scope.jobObject.timestamp);

        //Update status automatically when the page is loading 
       $scope.updateStatus();
      })
       .catch(function(e){
          console.error(e);
          throw e;
        });
    }
    $scope.getJobObject();

    $scope.killJob = function() {
      clusterpost.killJob($scope.jobId).then(function(res){
        console.log("Job " + $scope.jobId + " is killed");
        $scope.updateStatus();
      })
      .catch(function(e){
        throw e;
      });
    }



		$scope.reRunJob = function(){
			
  		  var force = false;
        $scope.loadRestart = true;
        if($scope.jobObject.jobstatus.status != "CREATE") 
        {
          if(confirm("Did you check outputs log file ? Be sure you have correct inputs file. \n Are you sure you want to force the job submission ? ")){
            force = true;
          }
          else
          {
            return 0;
          }
        }
        clusterpost.submitJob($scope.jobId,force).then(function(res){
            $scope.loadRestart = false;
		        console.log("Job " + $scope.jobId + " submit");
            $scope.updateStatus();
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

    $scope.getOutputDirectoryURL = function(jobid, name)
    {
      console.log("IN");
      $scope.loadDir = true;
      clusterpost.getDownloadToken(jobid, name)
      .then(function(res){
        console.log("IN2")
        var pom = document.createElement('a');
            
        document.body.appendChild(pom);
        pom.style = "display: none";
        var filename = name;        
        pom.href = "/dataprovider/download/" + res.data.token;
        pom.download = filename;
        $scope.loadDir = false;
        pom.click();        
        document.body.removeChild(pom);
        
      })
      .catch(function(err){
        console.error(err);
      });
    }

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
        $scope.viewLogOutput = true;
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
            $scope.viewLogErrorOutput = true;
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

      $scope.loadDeleteDB = true;
      if(confirm("Do you really want delete this job : " + $scope.jobObject.inputs[0].name + "fromn de database ? This action is irreversible."))
      {
        clusterpost.deleteJob($scope.jobId).then(function(res){
            console.log("Job " + $scope.jobId + " is delete ");
            $scope.loadDeleteDB = false;
            $scope.jobDelete = true;
        })
        .catch(function(e){
              throw e;
        }); 
      }   
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

      $scope.loadPlot =true;
			var promarray = [
				$scope.getMatrix(),
				$scope.getParcellationTable()
			];

			Promise.all(promarray)
			.then(function(res){
				var matrixOut = res[0];
				var tableDescription = res[1];
        $scope.jsonObjectForPlotting = {
          "fdt_matrix" : matrixOut,
          "jsonTableDescripton" : tableDescription
        }
                $scope.loadPlot =false;

        $scope.viewCirclePlot = true;
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