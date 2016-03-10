angular.module('brainConnectivity')
.directive('jobStatus', function($routeParams,$location,clusterpost, probtrack){

	function link($scope,$attrs,$filter){

		$scope.getStatusRequest = false;
		$scope.getJobRequest = false;
		$scope.jobKill = false;

		$scope.jobDone = false;
		$scope.jobCancel = false;
		$scope.plotCircle = false;

		var id = $scope.jobId;
		console.log("Job id :", id);


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
			clusterpost.getJob(id).then(function(res){
					console.log(res);
					$scope.jobStatus = res.data.jobstatus.status;
					$scope.jobStatus = "DONE";
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
						$scope.jobCancel = true;
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

		 $scope.removeCircle = function()
		  {
		  	console.log("REMOVE");
		  	console.log($scope.plotID);
		  	var circlePlot = document.getElementById($scope.plotID);
		  	circlePlot.parentNode.removeChild(circlePlot);
		  /*	var tooltipPlot = document.getElementById("tooltip");
		  	tooltipPlot.parentNode.removeChild(tooltipPlot);
		  	var allImg = document.getElementById("divBrainImgALL");
		  	allImg.parentNode.removeChild(allImg);
		  	var allLink = document.getElementById("divBrainLinkALL");
		  	allLink.parentNode.removeChild(allLink);
		  	var rightImg = document.getElementById("divBrainImgRight");
		  	rightImg.parentNode.removeChild(rightImg);
		  	var rightLink = document.getElementById("divBrainLinkRight");
		  	rightLink.parentNode.removeChild(rightLink);
		  	var leftImg = document.getElementById("divBrainImgLeft");
		  	leftImg.parentNode.removeChild(leftImg);
		  	var leftLink = document.getElementById("divBrainLinkLeft");
		  	leftLink.parentNode.removeChild(leftLink);*/

  		  }
		
		$scope.connectivityVisualisation = function(){

			if($scope.plotCircle == false)
			{
				$scope.plotCircle = true;
				$scope.submit();
			}
			else
			{
				$scope.plotCircle = false;
				
			}
			


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