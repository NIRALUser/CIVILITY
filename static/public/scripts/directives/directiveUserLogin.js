
angular.module('brainConnectivity')
.directive('userLogin', function($routeParams, $location, $rootScope, clusterauth){
	function link($scope,$attrs,$filter){
	
	$scope.showLogin = true;
	$scope.newUser = {};
	$scope.user = {};

	$scope.resetUser = false;

	if($routeParams.token){
		$scope.showLogin = false;
		$scope.resetUser = {
			token: $routeParams.token
		}
	}
	
	$scope.createUser = function(){
		clusterauth.createUser($scope.newUser)
		.then(function(){
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/tractographyApp');
		})
	}

	$scope.recoverPassword = function(){
		if(!$scope.user.email)
		{
			alert("No email address specified in email field.");
			return false;
		}
		clusterauth.sendRecoverPassword({
			email: $scope.user.email
		})
		.then(function(res){
			alert(res.data);
		})
	}

	$scope.resetPassword = function(){
		if($scope.resetUser.password0 === $scope.resetUser.password1){
			clusterauth.updatePassword({
				password: $scope.resetUser.password1
			}, $scope.resetUser.token)
			.then(function(){
				return clusterauth.getUser();
			})
			.then(function(res){
				$rootScope.user = res.data;
				$location.path('/tractographyApp');
			})
			.catch(function(e){
				alert('Password must contains 8 characters including one uppercase letter, one special character, one number and alphanumeric characters')
				console.error(e);
				throw e;
			});
		}
		else
		{
			alert('Passwords are not the same');
			return false;
		}
	}

	$scope.login = function(){
		clusterauth.login($scope.user)
		.then(function(){
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/tractographyApp');
		});
	}

	$scope.switchForm = function(){
		$scope.showLogin=!$scope.showLogin;
	}
};

return {
    restrict : 'E',
    link : link,
    templateUrl: 'views/directives/directiveUserLogin.html'
}

});

