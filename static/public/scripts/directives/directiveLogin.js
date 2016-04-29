
angular.module('brainConnectivity'/*, ['angular-jwt']*/)
/*.config(function Config($httpProvider, jwtInterceptorProvider) {
  // Please note we're annotating the function so that the $injector works when the file is minified
  jwtInterceptorProvider.tokenGetter = ['config', function(config) {    
  	console.log(config.url);
  	return null;
    return localStorage.getItem('clusterpost_token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
})*/
.directive('createUserDir', function($routeParams,$location,clusterpost){


function link($scope,$attrs,$filter){
	$scope.createUser = function(){

		clusterpost.createUser($scope.newUser)
		.then(function(res){			
			localStorage.setItem('clusterpost_token', res.token);
		})
		.catch(function(err){
			console.error(err);
		});

	}	

	$scope.login = function(){
		clusterpost.createUser($scope.newUser)
		.then(function(res){			
			localStorage.setItem('clusterpost_token', res.token);
		})
		.catch(function(err){
			console.error(err);
		});

	}	
};

return {
    restrict : 'E',
/*    scope: {
    	testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveLogin.html'
}

});

