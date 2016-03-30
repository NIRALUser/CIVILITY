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

		var id = $scope.jobId;
		console.log("Job id :", id);


		$scope.reRunJob = function(){

			    //Submit job 
		    clusterpost.submitJob(id).then(function(res){
		        console.log("Job " + id + " submit");
		        $scope.jobKill = false;
		    })
		    .catch(function(e){
		      console.log(e);
		    });
		}


  		$scope.paramInfo = function(){
  			if($scope.jobInfo.data.parameters[8].name == true)
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


		$scope.getData = function(){

				console.log("Get data");
				clusterpost.getAttachment(id,"neonate/Diffusion/nodif_brain_mask.nii.gz").then(function(res){
					console.log(res);


					var a = document.createElement("a");
			        document.body.appendChild(a);
			        a.style = "display: none";
			        var url = window.URL.createObjectURL(res.data);
			        a.href = url;
			        a.download = name;
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
				clusterpost.getJob(id).then(function(res){
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
			clusterpost.getJobStatus(id).then(function(res){
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
			clusterpost.killJob(id).then(function(res){
        	console.log("Job " + id + " is killed");
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