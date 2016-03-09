angular.module('brainConnectivity')
.directive('jobStatus',function($routeParams,$location,clusterpost){

	function link($scope,$attrs,$filter){

		var id = $scope.jobId;
		console.log("Job id :", id);

		$scope.getData = function(){

				console.log("Get data");

		}

		$scope.getJob = function(){

				console.log("Get job");
				clusterpost.getJob(id).then(function(res){
					console.log(res);
					$scope.jobInfo = res;
					
				})

		}

		$scope.getStatus = function(){

			console.log("Get status");
			clusterpost.getJobStatus(id).then(function(res){
				console.log("Status : ",res);
			})
		}

		$scope.killJob = function(){
			console.log("KillJob");
			clusterpost.killJob(id).then(function(res){
        	console.log("Job " + id + " is killed");
       		})

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