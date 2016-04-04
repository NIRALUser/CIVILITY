
angular.module('brainConnectivity')
.directive('testDir', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  $scope.valueK = 0 ;

  $scope.showContentJson = function($fileContent){
        $scope.contentJ = $fileContent;
    };

	$scope.changeData = function()
    {
    var file_name = "PCAreconstructionSVD_" +  $scope.valueK ;
    }



$scope.$watch("valueK", function(){
        console.log("HelloWatch svalue K ", $scope.valueK);
        $scope.changeData();
      });
};

return {
    restrict : 'E',
/*    scope: {
    	testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveTest.html'
}

});

