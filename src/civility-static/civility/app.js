'use strict';

// Declare app level module which depends on views, and components
angular.module('CIVILITY', [
  'ngRoute',
  'ui.bootstrap',
  'smart-table'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider    
  .when('/welcome', {
    templateUrl: 'views/controllers/welcome.html'
  })
  .when('/tractographyApp', {
    templateUrl: 'views/controllers/tractographyApp.html'
  })
  .when('/login/reset', {
    templateUrl: 'views/controllers/welcome.html'
  })
  .when('/notFound', {
    templateUrl: 'views/controllers/notFound.html'
  })
  .otherwise({redirectTo: '/welcome'});
}]);
