

angular.module('brainConnectivity')
.controller('visualisation', ['$scope','$http','probtrack', function($scope, $http, probtrack) {

  $scope.plotVisible = false ;
  $scope.ButtonClicked = false;
  $scope.plotData = undefined;
  $scope.plotParameters = {};

  $scope.submit = function(){

    probtrack.getFDTMatrix()
    .then(function(response){
      $scope.ButtonClicked = true;
      $scope.plotParameters.link1 = "";
      $scope.plotParameters.link2 = "";
      $scope.plotParameters.threshold = 0.1;
      $scope.plotParameters.method = [true,false,false];
      $scope.plotParameters.tension = 85;
      $scope.plotParameters.diameter = 960
      $scope.plotParameters.upperValue = 1;
      $scope.plotParameters.data = response.data;
      $scope.Plot;
    }).catch(console.error);

  }


}]);
