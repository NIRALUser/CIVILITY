
angular.module('brainConnectivity')
.directive('computePca', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){


 $scope.param = {};

  $scope.valueK = 0 ;

  $scope.jobsSelectedPCA = [];

  //console.log($scope.jobsSelectedPCA)

  $scope.showContentJson = function($fileContent){
        $scope.contentJ = $fileContent;
    };

$scope.showContentMatrix = function($fileContent){
        $scope.contentM = $fileContent;
    };

	$scope.changeData = function()
    {
    var file_name = "PCAreconstructionSVD_" +  $scope.valueK ;
    }

$scope.addMatrixToList = function(){

      var param = {
        id : "none",
        subject : $scope.param.subjectID,
        type : "matrix added",
        matrix : $scope.contentM
      };

      $scope.jobsSelectedPCA.push(param);
}

$scope.removeFromList = function(job){
    $scope.jobsSelectedPCA.splice( $scope.jobsSelectedPCA.indexOf(job) , 1 );               
}

$scope.matrixAsVector = function(matrix){

    var lines = matrix.split('\n');

    return vector; 
}

$scope.runPCA = function(){

    var vectorList = []
    _.each($scope.jobsSelectedPCA,function(value,key){
        var vector = $scope.matrixAsVector(value.matrix);
    })

    //Create matrix of all vectors 

    //Create file : 

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
    templateUrl: 'views/directives/directiveComputePCA.html'
}

});

