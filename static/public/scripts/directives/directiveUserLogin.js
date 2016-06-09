
angular.module('CIVILITY')
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
		$scope.errorMsg = "";
		clusterauth.createUser($scope.newUser)
		.then(function(){
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/tractographyApp');
		})
		.catch(function(e){
			if(e.status === 409)
			{
				$scope.errorMsg = "An account already exist with this email address. Login with your account or create a new one with a new email address";
				//alert("An account already exist with this email address. Recover password or create a new account with a new email address");
			}
			throw e;
		});
	}

	$scope.recoverPassword = function(){
		$scope.errorMsg = "";
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
		.catch(function(e){
			if(e.status === 401)
			{
				$scope.errorMsg = "I don't know who you are, you need to create an account first!"
			}
		})
	}

	$scope.resetPassword = function(){
		$scope.errorMsg = "";
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
				alert('Password must contains 6 characters including at least one uppercase letter and one number - special characte allowed')
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
		$scope.errorMsg = "";
		clusterauth.login($scope.user)
		.then(function(){
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/tractographyApp');
		})
		.catch(function(e){
			if(e.status === 401 && $scope.user.password)
			{
				$scope.errorMsg = "Wrong identification - check if email and password are corrects";
				//alert("Wrong identification - check if email and password are corrects");
			}
			console.log(e);

			throw e;
		});
	}

	$scope.switchForm = function(){
		$scope.errorMsg="";
		$scope.showLogin=!$scope.showLogin;
	}
};

return {
    restrict : 'E',
    link : link,
    templateUrl: 'views/directives/directiveUserLogin.html'
}

});

