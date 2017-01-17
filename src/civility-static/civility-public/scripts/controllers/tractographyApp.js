
angular.module('CIVILITY')
.controller('tractographyAppController', function($routeParams, $scope, $http, $route, clusterpostService) {

	$scope.routeParams = {};
	if($routeParams.activeTab){
		$scope.routeParams.activeTab = parseInt($routeParams.activeTab);
	}
	if($routeParams._id){
		clusterpostService.getJob($routeParams._id)
		.then(function(res){
			$scope.job = res.data;
		});
	}
	

	$scope.jobCallback = function(job){
		$scope.job = job;
		$scope.routeParams.activeTab = 3;
		$scope.routeParams._id = job._id;
	}

	$scope.downloadCallback = function(job){

		var output = _.find(job.outputs, function(output){
			return output.type === "tar.gz";
		});

		if(output){
			clusterpostService.getDownloadAttachmentURL(job._id, output.name)
			.then(function(res){
				var pom = document.createElement('a');
				pom.setAttribute('href', res);
				pom.setAttribute('download', output.name + ".tar.gz");

				pom.dataset.downloadurl = ['application/octet-stream', pom.download, pom.href].join(':');
				pom.draggable = true; 
				pom.classList.add('dragout');
				document.body.appendChild(pom);
				pom.click();

			})
			.catch(console.error);
		}
	}

	$scope.$watch('routeParams', function(){
		$route.updateParams($scope.routeParams);
	}, true);
});

