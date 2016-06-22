angular.module('CIVILITY')
.directive('adminUserPrivileges', function($routeParams,$location,clusterpost, $filter, $q){

	function link($scope,$attrs){

		$scope.getAllUsers = function(){


			/*clusterpost.getAllUsers().then(function(res){

			})*/
		}

		$scope.saveDocument = function(){

		}

		

	}

	return {
		    restrict : 'E',
		    link : link,
		    templateUrl: 'views/directives/directiveAdminUserPrivileges.html'
	}

});
