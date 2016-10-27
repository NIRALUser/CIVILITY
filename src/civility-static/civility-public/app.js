'use strict';

// Declare app level module which depends on views, and components
angular.module('CIVILITY', [
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap',
  'smart-table',
  'clusterpost-list'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider    
  .when('/', {
    redirectTo: '/login'
  })
  .when('/login', {
    templateUrl: 'views/controllers/welcome.html'
  })
  .when('/home', {
    templateUrl: 'views/controllers/tractographyApp.html',
    reloadOnSearch:false
  })
  .when('/admin-jobs', {
    templateUrl: 'views/controllers/admin-jobs.html'
  })
  .when('/admin-users', {
    templateUrl: 'views/controllers/admin-users.html'
  })
  .when('/login/reset', {
    templateUrl: 'views/controllers/welcome.html'
  })
  .when('/notFound', {
    templateUrl: 'views/controllers/notFound.html'
  })
  .otherwise({redirectTo: '/notFound'});
}]);

angular.module('CIVILITY')
.controller('mainController', function($scope, $location){
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