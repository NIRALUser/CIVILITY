angular.module('CIVILITY')
.controller('main', function($scope, $http, $location) {


	$scope.showNavBar = false;

	if($location.path().indexOf('/login') === -1){
		$scope.showNavBar = true;
	}


	$scope.$on('$routeChangeStart', function(){
		if($location.path().indexOf('/login') === -1){
			$scope.showNavBar = true;
		}else{
			$scope.showNavBar = false;
		}
	});
	

});