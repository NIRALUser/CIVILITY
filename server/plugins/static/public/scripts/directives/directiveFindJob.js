
angular.module('brainConnectivity')
.directive('findJob', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  $scope.jobFound = [];
  $scope.viewResult = true;
  $scope.noResult = false;
  $scope.selectStatus ={};
  $scope.selectStatus.selection = "All status";

  $scope.statusAvail = ["All status","CREATE", "DOWNLOADING", "RUN", "FAIL", "KILL", "UPLOADING", "EXIT", "DONE"];

   $scope.getJobByUser = function(){

    $scope.jobFound = [];
    $scope.noResult = false;
    $scope.viewResult =false; //delete and recreate

    //console.log($scope.selectStatus.selection);
    if($scope.selectStatus.selection=="All status") {
         $scope.selectStatus.selection = undefined;
    }
    clusterpost.getJobUser($scope.userEmail, $scope.selectStatus.selection, "tractographyScriptApp.sh").then(function(res){
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
   $scope.deleteJob = function(id){
      console.log("DeleteJob");
      clusterpost.deleteJob(id).then(function(res){
          console.log("Job " + id + " is delete ");
          })
    }
  $scope.deleteAllDatabase = function(){
    var res = confirm("You are about to delete all jobs associated with this email " + $scope.userEmail + ". This means that all data and results will be lost, if you didn't save them before. Do you really wanted clean up all the database ? ")
    if(res== true)
    {
       _.each($scope.jobFound, function(val,i){
           $scope.deleteJob(val._id);
       })
    }
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
