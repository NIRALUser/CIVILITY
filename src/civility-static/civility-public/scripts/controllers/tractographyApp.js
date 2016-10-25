
angular.module('CIVILITY')
.controller('tractographyAppController', function($scope, $http, clusterpostService) {

	$scope.jobCallback = function(job){
		$scope.job = job;
		$scope.activeTab = 3;
	}

});

