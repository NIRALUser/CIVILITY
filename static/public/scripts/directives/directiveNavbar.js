
angular.module('brainConnectivity')
.directive('navbar', function($routeParams, $location, $rootScope, clusterauth){

	function link($scope,$attrs,$filter){

		$scope.isAdmin = false;
		$scope.getName = function(){
			clusterauth.getUser().then(function(res)
			{
				console.log(res);
				$scope.loginName = res.data.name;
				_.each(res.data.scope, function(val){
					if(val == "admin")
					{
						$scope.loginName += " (admin)";
						$scope.isAdmin = true;
					}	
				})
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