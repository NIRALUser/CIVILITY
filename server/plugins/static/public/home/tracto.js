

angular.module('brainConnectivity')
.controller('firstController', ['$scope','$http','probtrack', function($scope, $http, probtrack) {

  $scope.plotVisible = false ;
  $scope.ButtonClicked = false;
  $scope.plotData = undefined;
  $scope.plotParameters = {};

  $scope.test = function(){

    console.log("TESSST im in scope")

   var nav = document.getElementById("tracto");
   nav.attr("color-background", "blue");

  }
}]);


