
angular.module('brainConnectivity')
.directive('findJob', function($routeParams,$location,clusterpost, clusterauth){

function link($scope,$attrs,$filter){

  $scope.jobFound = [];
  $scope.noResult = false;
  $scope.selectStatus ={};
  $scope.selectStatus.selection = "DONE";
  $scope.statusAvail = ["All status","CREATE", "DOWNLOADING", "RUN", "FAIL", "KILL", "UPLOADING", "EXIT", "DONE"];

  $scope.listPCA = "none";
  clusterauth.getUser().then(function(res){
      $scope.userEmail = res.data.email;
      _.each(res.data.scope, function(val){
          if(val == "admin")
          {
            $scope.isAdmin = true;
          } 
        })
  })
  .catch(function(e){
        console.error(e);
        throw e;
  })
  
//get job according to login user 
  $scope.getJobByUser = function(){

    $scope.jobFound = [];
    $scope.noResult = false;

    //console.log($scope.selectStatus.selection);
    if($scope.selectStatus.selection=="All status") {
         $scope.status = undefined;
    }
    else
    {
        $scope.status = $scope.selectStatus.selection;
    }
    clusterpost.getJobUser($scope.userEmail, $scope.status, "tractographyScriptApp.sh").then(function(res){
      console.log(res);
       var jobF = $scope.jobFound;
      _.each(res.data, function(val, ind){  
        jobF.push(val);
      })
      $scope.jobFound = jobF;

      if(jobF.length == 0 )
      {
        $scope.noResult = true;
      }
    })
  }
  //Delete single job
  $scope.deleteJob = function(id){
      console.log("DeleteJob");
      clusterpost.deleteJob(id).then(function(res){
          console.log("Job " + id + " is delete ");
          })
  }
  //Delete multiples jobs
  $scope.deleteAllDatabase = function(){
    var res = confirm("You are about to delete all jobs associated with this email " + $scope.userEmail + ". This means that all data and results will be lost, if you didn't save them before. Do you really wanted clean up all the database ? ")
    if(res== true)
    {
       _.each($scope.jobFound, function(val,i){
           $scope.deleteJob(val._id);
       })
    }
  }
  $scope.$watch("selectStatus.selection", function(){
     console.log("HelloWatch selectStatus.selection", $scope.selectStatus.selection);
     $scope.getJobByUser();
    });

};
return {
    restrict : 'E',
    link : link,
    templateUrl: 'views/directives/directiveFindJob.html'
}

});
