
angular.module('brainConnectivity')
.directive('navbar', function($routeParams, $location, $rootScope, clusterauth){

	function link($scope,$attrs,$filter){

		$scope.getName = function(){
			clusterauth.getUser().then(function(res)
			{
				console.log(res);
				$scope.loginName = res.data.name;
				//if(res.data.)
			})		
		};


		$scope.getName();
		$scope.logout = function(){
			clusterauth.logout();
		};
	};

	return {
    	restrict : 'E',
    	link : link,
    	templateUrl: 'views/directives/directiveNavbar.html'
	}

});