
angular.module('brainConnectivity')
.directive('navbar', function($routeParams, $location, $rootScope, clusterauth){

	function link($scope,$attrs,$filter){

		$scope.logout = function(){
			clusterauth.logout();
		}
	};

	return {
    	restrict : 'E',
    	link : link,
    	templateUrl: 'views/directives/directiveNavbar.html'
	}

});