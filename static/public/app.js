'use strict';

// Declare app level module which depends on views, and components
angular.module('brainConnectivity', [
  'ngRoute',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'views/controllers/home.html'
  })
  .when('/welcome', {
    templateUrl: 'views/controllers/welcome.html'
  })
  .when('/tractographyApp', {
    templateUrl: 'views/controllers/tractographyApp.html'
  })
  .when('/tracto', {
    templateUrl: 'views/controllers/tracto.html'
  })
  .when('/jobSummary', {
    templateUrl: 'views/controllers/jobSummary.html'
  })
  .when('/visualisation', {
    templateUrl: 'views/controllers/visualisation.html'
  })
  .when('/createJSON', {
    templateUrl: 'views/controllers/createJSON.html'
  })
  .when('/plotMatrix', {
    templateUrl: 'views/controllers/plotMatrix.html'
  })
  .otherwise({redirectTo: '/home'});
}]);
