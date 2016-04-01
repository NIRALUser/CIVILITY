
angular.module('brainConnectivity')
.directive('jobsDone', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  //s$scope.listJobs = ["1234","56789"];
  $scope.status = "DONE";
  $scope.jobFound = [];
  $scope.viewResult = false;
  $scope.noResult = false;

   $scope.getJobDoneByUser = function(){

    $scope.jobFound = [];
    $scope.noResult = false;
    $scope.viewResult =false; //delete and recreate

    //console.log($scope.selectStatus.selection);

    clusterpost.getJobUser($scope.userEmail,  $scope.status, "tractographyScriptApp.sh").then(function(res){
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
    templateUrl: 'views/directives/directiveJobsDone.html'
}

});
