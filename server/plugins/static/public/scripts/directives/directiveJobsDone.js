
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

    $scope.jobsSelectedPCA = [];

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

  $scope.getMatrix = function(id,filepath){ 
      return clusterpost.getAttachment(id,filepath,"text").then(function(res){
        return res.data;
      })
      .catch(function(e){
            console.error("Error getting matrix", e);
            throw e;
        });
    }

  $scope.getParcellationTable = function(id,filepath){ 
      return clusterpost.getAttachment(id,filepath,"json").then(function(res){
        return res.data;
      })
      .catch(function(e){
            console.error("Error getting parcellationTable", e);
            throw e;
        });
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

  $scope.allJobManuallySelect = function(){
    if( $scope.jobsSelectedPCA != undefined )
    {
      var nbJobSelect = 0;
      _.each($scope.jobsSelectedPCA, function(v)
      {
        if(v.type == "job") nbJobSelect++;
      })
      if($scope.jobFound.length == nbJobSelect && $scope.viewResult == true)
      {
        $scope.selectAllJobPCA = true;
      }
      else
      {
        $scope.selectAllJobPCA = false;
      }
    }
  }

  $scope.clickCheckbox = function(){
    if($scope.selectAllJobPCA == false)
    {
       var toDeleteIndex = [];
       _.each($scope.jobsSelectedPCA, function(val,i){
        if(val != undefined && val.type == "job")
        {
            toDeleteIndex.push(i);
            console.log(val, i );
           // $scope.jobsSelectedPCA.splice(k, 1); 
        }     
      })
       toDeleteIndex.sort();
       toDeleteIndex.reverse();
       console.log(toDeleteIndex);
        for(var i = 0 ; i < toDeleteIndex.length ; i++)
        {
          $scope.jobsSelectedPCA.splice(toDeleteIndex[i], 1); 
        }
        console.log($scope.jobsSelectedPCA);
    }
  }

  $scope.allJobToListPCA = function(){

    if($scope.selectAllJobPCA == true)
    {
        _.each($scope.jobFound, function(val,i){

          var param = {
        id : "",
        subject : "",
        type : "job",
        matrix : "",
        parcellationTable : ""
      };
      console.log(val);
      param.id = val._id;
      var pathMat = val.outputs[0].name;
      var pathJson = val.outputs[1].name;
      param.subject = val.parameters[0].name;
      $scope.getMatrix(val._id,pathMat).then(function(res){
        param.matrix=res;
      });
      $scope.getMatrix(val._id,pathJson).then(function(res){
        param.parcellationTable=res;
      })
      var inList = false;
      _.each($scope.jobsSelectedPCA, function(v,i){
        if(v.id == val._id)
        {
          inList = true;
        }
      })
      if( inList != true) {
        $scope.jobsSelectedPCA.push(param);
        }  
     })
         
    }
    else
    {   
       //
    }
  }
 $scope.$watch("selectAllJobPCA", function(){
        console.log("HelloWatch selectAllJobPCA", $scope.selectAllJobPCA);
        $scope.allJobToListPCA();
      });

 $scope.$watchCollection("jobsSelectedPCA", function(){
        console.log("HelloWatch jobsSelectedPCA", $scope.jobsSelectedPCA);
        $scope.allJobManuallySelect();
      });
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
