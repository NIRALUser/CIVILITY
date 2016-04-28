'use strict';

// Declare app level module which depends on views, and components
angular.module('brainConnectivity', [
  'ngRoute',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/welcome', {
    templateUrl: 'views/controllers/welcome.html'
  })
  .when('/tractographyApp', {
    templateUrl: 'views/controllers/tractographyApp.html'
  })
  .otherwise({redirectTo: '/welcome'});
}]);
