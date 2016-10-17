angular.module('CIVILITY')
.directive('adminUserPrivileges', function($routeParams,$location, clusterauth, $filter, $q){

	function link($scope,$attrs){

		$scope.getAllUsers = function(){
			clusterauth.getUsers().then(function(res){
				console.log(res.data);
				$scope.rowCollection = res.data;
			})
			.catch(function(e){
                console.error(e);
            });
		}

		$scope.itemsByPage = "10";
		$scope.rowCollection = [];
		$scope.getAllUsers();

		$scope.saveUser = function(user)
		{
			clusterauth.updateUser(user).then(function(res){
				console.log(res);
			})
			.catch(function(e){
				throw e;
            });
		}

		$scope.saveUserDoc = function(user,defaultVal,clusterpostVal,adminVal){

			$scope.privileges = {
					"defaultVal" : (user.scope.indexOf('default') > -1),
					"clusterpostVal" : (user.scope.indexOf('clusterpost') > -1),
					"adminVal" : (user.scope.indexOf('admin') > -1)
			}
	
			if(!$scope.privileges.defaultVal && defaultVal)
			{
				console.log("1");
				user.scope.push("default");
			}
			else if ($scope.privileges.defaultVal && !defaultVal)
			{
				console.log("2");	
				user.scope.splice(user.scope.indexOf("default"),1);
			}

			if(!$scope.privileges.clusterpostVal && clusterpostVal)
			{
				console.log("3");
				user.scope.push("clusterpost");
			}
			else if ($scope.privileges.clusterpostVal && !clusterpostVal)
			{
				console.log("4");
				user.scope.splice(user.scope.indexOf("clusterpost"),1);
			}

			if(!$scope.privileges.adminVal && adminVal)
			{
				console.log("5");
				user.scope.push("admin");
			}
			else if ($scope.privileges.adminVal && !adminVal)
			{
				console.log("6");
				user.scope.splice(user.scope.indexOf("admin"),1);
			}
			$scope.saveUser(user);
		}

		$scope.deleteUser = function(user){
			clusterauth.deleteUser(user).then(function(){
			})
			.catch(function(e){
                console.error(e);
            });
		}


		/*$scope.$watch("clusterpost", function(){
		    console.log("clusterpost change", $scope.clusterpost);
		  //  $scope.NewPlot();
		  });
		$scope.$watch("admin", function(){
		    console.log("admin change", $scope.admin);
		  //  $scope.NewPlot();
		  });*/

	}

	return {
		    restrict : 'E',
		    link : link,
		    templateUrl: 'views/directives/directiveAdminUserPrivileges.html'
	}

});
