
angular.module('brainConnectivity')
.directive('submitTracto', function($routeParams,$location,clusterpost, $http){

  function link($scope,$attrs,$filter){

    $scope.jobSumitConfirmation = [];
    
    $scope.tools = {
      bedpostx : {},
      probtrackx2 : {}
    };
    //Bedpostx
    $scope.tools.bedpostx.param = "-n 2";
    $scope.tools.bedpostx.id = "bedpostxInfo";
    $scope.tools.bedpostx.modify = false;
    $http({
      method: 'GET',
      url: '/public/data/bedpostxHelp-FSL-5.0.8.txt'
    })
    .then(function(res){
      $scope.tools.bedpostx.help = res.data;
    });

    $http({
      method: 'GET',
      url: '/public/data/jsonDescriptionTableTemplate.txt'
    })
    .then(function(res){
      $scope.jsonTemplate = res.data;
    });

    //Probtrackx
    $scope.tools.probtrackx2.param = "-P 3000 --steplength=0.75 --sampvox=0.5";
    $scope.tools.probtrackx2.id = "probtrackx2Info";
    $scope.tools.probtrackx2.modify = false;
    $http({
      method: 'GET',
      url: '/public/data/probtrackx2Help-FSL-5.0.8.txt'
    })
    .then(function(res){
      $scope.tools.probtrackx2.help = res.data;
    });

    

    $scope.formOK = false;
    $scope.submitTractoButton = false;
    $scope.serverselect = {
      selection : null
    };
    $scope.Parameters = {
      subject : "",
      Files : {
                DWI : "",
                T1 : "",
                BrainMask:"",
                parcellationTable: "",
                innerSurface: "",
                colorSurface: ""
              },
      labelsetName: "colour",
      ignoreLabel: false,
      ignoreLabelID : "setlabelID",
      overlapping: true,
      loopcheck: true,
      bedpostX : $scope.tools.bedpostx.param,
      probtrackParam : $scope.tools.probtrackx2.param

    };

    $scope.usableInputBedpostx = function(toolX){

      var bool = toolX.modify;
      console.log(toolX.id);
      if(bool === true && confirm('Do you really want to modify bedpostx parameters ?') == true)
      {
        
        document.getElementById(toolX.id).disabled = false;
      }
      else
      {
        document.getElementById(toolX.id).disabled = true;
      }
      
    }

    $scope.paramSubmitJob = function(){
      $scope.formOK = $scope.formValidation();
      if($scope.formOK == true)
      {
        $scope.Parameters.overlapping = $scope.overlapping;
        $scope.Parameters.loopcheck = $scope.loopcheck;
        $scope.createJobObject();

      }
    };

    $scope.formValidation = function(){
      //Subject ID 
      if(!$scope.Parameters.subject)
      {
        alert ("You must define a valid subject ID (only letters, numbers, \"-\", \"_\" are allowed - no space).");
        return false;
      }
      //DWI Image
      if(!$scope.Parameters.Files.DWI)
      {
        alert("You must select DWI file.");
        return false;
      }
      //T1 image
      if(!$scope.Parameters.Files.T1)
      {
        alert("You must select T1 file.");
        return false;
      }
      //Brain mask
      if(!$scope.Parameters.Files.BrainMask)
      {
        alert("You must select brainmask file.");
        return false;
      } 
      //Parcellation Table
      if(!$scope.Parameters.Files.parcellationTable)
      {
        alert("You must select parcellation Table file.");
        return false;
      } 
      //Inner Surface
      if(!$scope.Parameters.Files.innerSurface)
      {
        alert("You must select inner Surface file.");
        return false;
      }
      //Colored surface
      if($scope.checkedSurfaceColored  && $scope.Parameters.Files.innerSurface)
      {
        $scope.Parameters.Files.colorSurface = $scope.Parameters.Files.innerSurface;
      }
      else if ($scope.checkedSurfaceColored && !$scope.Parameters.Files.innerSurface)
      {
          //Do nothing 
      }
      else
      {
        if(!$scope.alternativeSurface )
        {
          alert("You must select an alternative surface file containing color labels.");
          return false;
        }
        else
        {
          $scope.Parameters.Files.colorSurface = $scope.alternativeSurface;
        }
      }
      //Check LabelSetName format pattern
      if(!$scope.Parameters.labelsetName)
      {
        alert ("You must define a valid labelset name (only letters, numbers, \"-\", \"_\" are allowed - no space).");
        return false;
      }
      //default string if ignoreLabel = false 
      if(!$scope.Parameters.ignoreLabel)
      {
        $scope.Parameters.ignoreLabelID = "set labelID";
      }
      else
      {
        if($scope.Parameters.ignoreLabelID == "set labelID")
        {
          alert ("You must specified the name of label to ignore - Change 'set labelID' by the name of label to ignore (example : 0 0 0)");
          return false;
        }
      }  
      //Check email select 
      if($scope.userEmail == undefined)
      {
        alert ("You must specify your email to receive tractography results");
        return false;
      }
      return true;
    };


    //Get servers available 
    clusterpost.getExecutionServers().then(function(res){
      $scope.serverselect.servers = res.data;
      $scope.serverselect.selection = res.data[0];
    });


    //Create job object / document and then upload file and submit 
    $scope.createJobObject = function(){
        $scope.submitTractoButton = true;
        var job = {};

        job.executable ="tractographyScriptApp.sh";

        job.parameters = [];
       _.each($scope.Parameters, function(value, key){
          if(key != "Files")
          {
            var param = {}; 
            param.flag = "";
            param.name = value.toString();
            job.parameters.push(param);
          }
          else if (key=="Files")
          {
            _.each($scope.Parameters.Files, function(value, key){
              var param = {}; 
              param.flag = "";
              param.name = value.name;
              job.parameters.push(param);
            });
          }
        });

      job.inputs = [];
      _.each($scope.Parameters.Files, function(value, key){
      var input = {}; 
          input.name = value.name;
          job.inputs.push(input);
      });

      job.outputs = [];
      //Output 1 : matrix file
      var param1 = {}; 
      param1.type = "file";
      param1.name = $scope.Parameters.subject + "/Network_overlapping_loopcheck/fdt_network_matrix";
      job.outputs.push(param1);
      //Output 2 : parcellation description table (json file)
      var param2 = {}; 
      param2.type = "file";
      param2.name = $scope.Parameters.subject + "/" + $scope.Parameters.Files.parcellationTable.name;
      job.outputs.push(param2);
      //Output 3 : {subject dir} -- all output dir (as tar.gz)
      var param3 = {}; 
      param3.type = "tar.gz";
      param3.name = $scope.Parameters.subject;
      job.outputs.push(param3);
      //Output 4 : output of job -- logFile
      var param4 = {}; 
      param4.type = "file";
      param4.name = "stdout.out";
      job.outputs.push(param4);
      //Output 5 :  output error of job -- logErrorFile
      var param5 = {}; 
      param5.type = "file";
      param5.name = "stderr.err";
      job.outputs.push(param5);

      job.type = "job"; 
      job.userEmail = $scope.userEmail;
      //job.executionserver =  "testserver";

      job.jobparameters = [];
      //Job param 1 : define the queue where is submit the job
      var paramJob1 = {}; 
      paramJob1.flag = "-q";
      paramJob1.name = "week";
      job.jobparameters.push(paramJob1);
      //Job param 2 : number of cpu 
      var paramJob2 = {}; 
      paramJob2.flag = "-n";
      paramJob2.name = "1";
      job.jobparameters.push(paramJob2);   
      //Job param 3 : request job on same host 
      var paramJob3 = {}; 
      paramJob3.flag = "-R";
      paramJob3.name = "span[hosts=1]";
      job.jobparameters.push(paramJob3);
      //Job param 4 : define memory required to the job
      var paramJob4 = {}; 
      paramJob4.flag = "-M";
      paramJob4.name = "10";
      job.jobparameters.push(paramJob4);

      //Select server 
      if($scope.serverselect.selection == "" || $scope.serverselect.selection == null)
      {
          alert("No server specified - you must choose one server to run a job on it");
      }
      else
      {
          job.executionserver = $scope.serverselect.selection.name;
      }
      var job_id = "";

    //Create Job   
    clusterpost.createJob(job)
    .then(function(res){
      console.log($scope.Parameters.Files);
      //Upload data
      console.log(res.data);
      var doc = res.data;
      job_id = doc.id;
      console.log("JOB", job)
      var val = $scope.readFilesAndSubmit(job_id); 
    })
    .catch(function(e){
      console.log(e);
    });
 };

  $scope.submitJobX = function(jobid,force){
    console.log(jobid,force)
    clusterpost.submitJob(jobid,force).then(function(res){
        console.log("Job " + jobid + " submit");
        $scope.submitTractoButton = false;
        $scope.jobSumitConfirmation.push("Job " + jobid + " is submited.");
    })
    .catch(function(e){
      $scope.submitTractoButton = false;
      $scope.jobSumitConfirmation.push("Job " + jobid + " submission failed.");
      console.error(e);
      throw e;
    });
  };

    $scope.uploadFiles = function(jobid, keys, index){
      return  clusterpost.addAttachment(jobid, $scope.Parameters.Files[keys[index]].name, $scope.Parameters.Files[keys[index]])
      .then(function(res){
        if(index < keys.length - 1)
        {
          return $scope.uploadFiles(jobid, keys, index+1);
        }
        else
        {
        return 'Done';
        }
      })//upload file        
      .catch(function(e){
        console.error(e);
        throw e;
      });   
    };

    $scope.readFilesAndSubmit = function(jobid){  
      var keys = _.keys($scope.Parameters.Files);
      $scope.uploadFiles(jobid, keys, 0).then(function(res){
          console.log(res);
          $scope.submitJobX(jobid,false);
      });
    };
    $scope.$watch("tools.bedpostx.modify", function(){
        console.log("HelloWatch tools.bedpostx.modify", $scope.tools.bedpostx.modify);
        $scope.usableInputBedpostx($scope.tools.bedpostx);
      });

    $scope.$watch("tools.probtrackx2.modify", function(){
        console.log("HelloWatch tools.probtrackx2.modify", $scope.tools.probtrackx2.modify);
        $scope.usableInputBedpostx($scope.tools.probtrackx2);
      });
};
return {
    restrict : 'E',
/*    scope: {
      jobID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveTracto.html'
}

});

