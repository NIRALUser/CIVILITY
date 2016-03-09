angular.module('brainConnectivity')
.controller('firstController', ['$scope','$http','clusterpost', function($scope, $http, clusterpost) {

	$scope.statusAvail = ["CREATE", "DOWNLOADING", "RUN", "FAIL", "KILL", "UPLOADING", "EXIT", "DONE"]

	$scope.getJobByUser = function(){
		console.log($scope.selectStatus.selection);
		clusterpost.getJobUser($scope.userEmail, $scope.selectStatus.selection, "scriptTestApp").then(function(res){
			console.log(res);
		})
	}


}]);