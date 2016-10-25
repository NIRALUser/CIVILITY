
angular.module('CIVILITY')
.controller('tractographyAppController', function($scope, $http, clusterpostService) {

	$scope.jobCallback = function(job){
		$scope.job = job;
		$scope.activeTab = 3;
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

				pom.click();

			})
			.catch(console.error);
		}
	}

});

