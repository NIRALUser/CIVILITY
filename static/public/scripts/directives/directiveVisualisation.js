
angular.module('brainConnectivity')
.directive('connectivityVisualisation', function($routeParams,$location,clusterpost){

function link($scope,$attrs,$filter){

  $scope.plotParam = {};

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
    }
};
return {
    restrict : 'E',
    link : link,
    templateUrl: 'views/directives/directiveVisualisation.html'
}

});

