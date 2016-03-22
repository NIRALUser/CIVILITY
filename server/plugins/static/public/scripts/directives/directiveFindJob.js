
angular.module('brainConnectivity')
.directive('findJob', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  $scope.jobFound = [];
  $scope.viewResult = true;
  $scope.noResult = false;

  $scope.statusAvail = ["All status","CREATE", "DOWNLOADING", "RUN", "FAIL", "KILL", "UPLOADING", "EXIT", "DONE"];

   $scope.getJobByUser = function(){

    $scope.jobFound = [];
    $scope.noResult = false;
    $scope.viewResult =false; //delete and recreate

    //console.log($scope.selectStatus.selection);
    if($scope.selectStatus.selection=="All status") {
         $scope.selectStatus.selection = undefined;
    }
    clusterpost.getJobUser($scope.userEmail, $scope.selectStatus.selection, "scriptTestApp").then(function(res){
      console.log(res);
       var jobF = $scope.jobFound;
      _.each(res.data, function(val, ind){  
        jobF.push(val);
      })
      $scope.viewResult=true;
      $scope.jobFound = jobF;
      if(jobF.length == 0 )
      {
        $scope.noResult = true;
      }
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
