
angular.module('CIVILITY')
.directive('navbar', function($routeParams, $location, $rootScope, clusterauth){

	function link($scope,$attrs,$filter){

		$scope.isAdmin = false;
		$scope.useComputingGrid = true;
		$scope.login={};
		$scope.getName = function(){
			clusterauth.getUser().then(function(res)
			{
				$scope.login = res.data				
			})
			.catch(function(e){
				console.error(e);
				throw e;
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