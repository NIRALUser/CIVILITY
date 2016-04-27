
angular.module('brainConnectivity')
.directive('connectivityVisualisation', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  $scope.ButtonClicked = false;
  $scope.plotData = undefined;
  $scope.plotParam = {};

  $scope.testD = undefined; 

  $scope.showContentJson = function($fileContent){
        $scope.contentJ = $fileContent;
    };

   $scope.showContentMatrix = function($fileContent){
        $scope.contentM = $fileContent;
    };

    $scope.createJsonObjectForPlotConnectivity = function(){
      $scope.jsonObjectForPlotConnectivity = {
          "fdt_matrix" : $scope.contentM,
          "jsonTableDescripton" : JSON.parse($scope.contentJ)
      }
      $scope.plotView = true;
      $scope.ButtonClicked = true;
      $scope.plotParam.link1 = "";
      $scope.plotParam.link2 = "";
      $scope.plotParam.threshold = 0.1;
      $scope.plotParam.tension = 85;
      $scope.plotParam.diameter = 960
      $scope.plotParam.upperValue = 1;
      $scope.plotParam.data = $scope.jsonObjectForPlotConnectivity; 

    }
};
return {
    restrict : 'E',
/*    scope: {
      testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveVisualisation.html'
}

});

