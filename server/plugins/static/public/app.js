'use strict';

// Declare app level module which depends on views, and components
angular.module('brainConnectivity', [
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'home/home.html'
  })
  .when('/createJSON', {
    templateUrl: 'home/createJSON.html'
  })
  .when('/plotMatrix', {
    templateUrl: 'home/plotMatrix.html'
  })
  .otherwise({redirectTo: '/home'});
}]);
