
angular.module('CIVILITY')
.directive('connectivityVisualisation', function($routeParams,$location,clusterpost, $http){

function link($scope,$attrs,$filter){

  $scope.plotParam = {};

  $http({
      method: 'GET',
      url: '/public/data/jsonDescriptionTableTemplate.txt'
    })
    .then(function(res){
      $scope.jsonTemplate = res.data;
    });

  $scope.showContentJson = function($fileContent){
        $scope.contentJ = $fileContent;
    };

   $scope.showContentMatrix = function($fileContent){
        $scope.contentM = $fileContent;
    };

    $scope.createJsonObjectForPlotConnectivity = function(){
    $scope.load = true;
     if($scope.contentM === undefined )
     {
       alert("You must select a matrix file");
       $scope.load = false;
       return false;
     }
     else if($scope.contentJ === undefined )
     {
       alert("You must select a json file which describe de parcellation table");
       $scope.load = false;
       return false;
     }

     if(testJSON($scope.contentJ))
      {
         $scope.jsonObjectForPlotConnectivity = {
          "fdt_matrix" : $scope.contentM,
          "jsonTableDescripton" : JSON.parse($scope.contentJ)
          }
        $scope.plotView = true;
        $scope.load = false;
      }
      else
      {
        alert("Parcellation file upload is not a JSON file");
        $scope.load = false;
        return false;
      }
    }

    function testJSON(text){
      try{
          JSON.parse(text);
          return true;
      }
      catch (error){
          return false;
      }
    }

};
return {
    restrict : 'E',
    link : link,
    templateUrl: 'views/directives/directiveVisualisation.html'
}

});

