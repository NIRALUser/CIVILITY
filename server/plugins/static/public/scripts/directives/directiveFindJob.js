
angular.module('brainConnectivity')
.directive('findJob', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

	$scope.test = function()
    {
     console.log("FIND JOB");

    }

  $scope.statusAvail = ["CREATE", "DOWNLOADING", "RUN", "FAIL", "KILL", "UPLOADING", "EXIT", "DONE"]

  $scope.getJobByUser = function(){
    //console.log($scope.selectStatus.selection);
    clusterpost.getJobUser($scope.userEmail, undefined, "scriptTestApp").then(function(res){
      console.log(res);
    })
  }

};
return {
    restrict : 'E',
/*    scope: {
    	testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveFindJob.html'
}

});
