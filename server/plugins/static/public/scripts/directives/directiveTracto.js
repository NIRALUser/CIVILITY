
angular.module('brainConnectivity')
.directive('submitTracto', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  $scope.formOK = false;
  $scope.submitTractoButton = false;
  $scope.serverselect = {
    selection : null
  };

   $scope.Parameters = {
      subject : "neonate",
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
      loopcheck: true
      }

      $scope.nbJobSubmit = 0;
    $scope.listJobs = [];
    //$scope.listJobs = ["123456","98765"];
 /*   $scope.outputFiles = ["neonate/Diffusion/nodif_brain_mask.nii.gz",
                          "neonate/Diffusion/data.nii.gz",
                          "neonate/Diffusion/bvals",
                          "neonate/Diffusion/bvecs",
                          "neonate/TABLE_AAL.json",
                          "neonate/seeds.txt",
                          "neonate/"+$scope.NetworkDir+"/fdt_network_matrix",
                          "neonate/"+$scope.NetworkDir+"/waytotal"];

    $scope.findDirectoryName();
    
    $scope.outputDirectories = ["neonate/Diffusion.bedpostX",
                                "neonate/"+$scope.NetworkDir];


   $scope.findDirectoryName = function(){
    if($scope.Parameters.overlapping == true && $scope.Parameters.loopcheck == true)
    {
      $scope.NetworkDir = "Network_overlapping_loopcheck";
    }
    else if ($scope.Parameters.overlapping == true && $scope.Parameters.loopcheck == false)
    {
      $scope.NetworkDir = "Network_overlapping";
    }
    else if ($scope.Parameters.overlapping == false && $scope.Parameters.loopcheck == true)
    {
      $scope.NetworkDir = "Network_loopcheck";
    }
    else
    {
      $scope.NetworkDir = "Network";
    }
   }*/

   $scope.noJobSubmit = function()
    {
      if($scope.listJobs.length == 0)  return true;
      else return false;
    }

    $scope.paramSubmitJob = function()
    {
      console.log("Submit");
      console.log("Emailfield", $scope.userEmail);
      $scope.formOK = $scope.formValidation();
      console.log("Valid",$scope.formOK);
      if($scope.formOK == true)
      {
          $scope.Parameters.overlapping = $scope.overlapping;
          $scope.Parameters.loopcheck = $scope.loopcheck;
          $scope.createJobObject();

      }

      console.log("END ");
      $scope.submitTractoButton = false;
      console.log($scope.Parameters);

    };

    $scope.formValidation = function()
  {
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

/*    //Check label name is specified when ignoreLabel = true 
    if($scope.Parameters.ignoreLabel && !$scope.Parameters.ignoreLabelID)
    {
       alert ("You must specified the name of label to ignore");
       return false;
    }
*/
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

  clusterpost.getExecutionServers().then(function(res){
    $scope.serverselect.servers = res.data;

   });

       $scope.createJobObject = function(){
        $scope.submitTractoButton = true;
      var job = {};

      //job.executable = "scriptTestApp"; 
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

      
      console.log("PARAMMM",$scope.Parameters)
      //Output 2 : parcellation description table (json file)
      var param2 = {}; 
      param2.type = "file";
      param2.name = $scope.Parameters.subject + "/" + $scope.Parameters.Files.parcellationTable.name;
      job.outputs.push(param2);


      //Output 3 : {subject dir} -- all output dir (as tar.gz)
      var param3 = {}; 
      param3.type = "tar.gz";
      param3.name = "neonate";
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
   


      //Search server avail 
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

      var val = $scope.readFilesAndSubmit(job_id);
 
    })
    .catch(function(e){
      console.log(e);
    });


 }

 $scope.printTest = function(){

  console.log("print test function");

 }

 $scope.submitJobX = function(jobid){
    console.log("before submit job");
    //Submit job 
    clusterpost.submitJob(jobid).then(function(res){
        console.log("Job " + jobid + " submit");
        $scope.listJobs.push(jobid);
    })
    .catch(function(e){
      console.log(e);
    });
 }

  $scope.uploadFiles = function(jobid, keys, index){

       return  clusterpost.addAttachment(jobid, $scope.Parameters.Files[keys[index]].name, $scope.Parameters.Files[keys[index]]).then(
     function(res){
        if(index < keys.length - 1){
        return $scope.uploadFiles(jobid, keys, index+1);
      }else{
        return 'Done';
      }
     })//upload file        
    .catch(function(e){
      console.log(e);
    });
    
  }

  $scope.readFilesAndSubmit = function(jobid){
    
    var keys = _.keys($scope.Parameters.Files);
    $scope.uploadFiles(jobid, keys, 0)
    .then(function(res){
      console.log(res);
      $scope.submitJobX(jobid);

    });
  }

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

