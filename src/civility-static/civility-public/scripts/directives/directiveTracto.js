
angular.module('CIVILITY')
.directive('submitTracto', function($routeParams,$location,clusterpostService, $http, clusterauth){

  function link($scope,$attrs,$filter){

    clusterauth.getUser()
    .then(function(res){
      $scope.user = res;
    });

    $scope.showPop = function(){
      $('#buttonpop').popover('show');
    }

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
      url: 'data/bedpostxHelp-FSL-5.0.8.txt'
    })
    .then(function(res){
      $scope.tools.bedpostx.help = res.data;
    });

    $http({
      method: 'GET',
      url: 'data/jsonDescriptionTableTemplate.txt'
    })
    .then(function(res){
      $scope.jsonTemplate = res.data.replace(/\\n/g, "&#13;&#10;");
    });

    //Probtrackx
    $scope.tools.probtrackx2.param = "-P 3000 --steplength=0.75 --sampvox=0.5";
    $scope.tools.probtrackx2.id = "probtrackx2Info";
    $scope.tools.probtrackx2.modify = false;
    $http({
      method: 'GET',
      url: 'data/probtrackx2Help-FSL-5.0.8.txt'
    })
    .then(function(res){
      $scope.tools.probtrackx2.help = res.data.replace(/\n/g, '<br>');
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
      probtrackParam : $scope.tools.probtrackx2.param,
      createTar: true
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
      return true;
    };


    //Get servers available 
    clusterpostService.getExecutionServers().then(function(res){
      $scope.serverselect.servers = res.data;
      $scope.serverselect.selection = res.data[0];
      $scope.serverselect.queue = {"name": "week"};
      if($scope.serverselect.selection.info && $scope.serverselect.selection.info.queues){
        $scope.serverselect.queue = $scope.serverselect.selection.info.queues[0];
      }
    });


    //Create job object / document and then upload file and submit 
    $scope.createJobObject = function(){
      $scope.submitTractoButton = true;
          
      var job = {
          "type": "job",
          "name": $scope.Parameters.subject,
          "executable": "tractographyScriptAppv2.0.sh",
          "parameters": [
              {
                  "flag": "--subject",
                  "name": $scope.Parameters.subject
              },
              {
                  "flag": "--dwi",
                  "name": $scope.Parameters.Files.DWI.name
              },
              {
                  "flag": "--t1",
                  "name": $scope.Parameters.Files.T1.name
              },
              {
                  "flag": "--mask",
                  "name": $scope.Parameters.Files.BrainMask.name
              },
              {
                  "flag": "--table",
                  "name": $scope.Parameters.Files.parcellationTable.name
              },
              {
                  "flag": "--surface",
                  "name": $scope.Parameters.Files.innerSurface.name
              },
              {
                  "flag": "--label_name",
                  "name": $scope.Parameters.labelsetName
              },
              {
                  "flag": "--bedpostxParam",
                  "name": "\"" + $scope.Parameters.bedpostX + "\""
              },
              {
                  "flag": "--probtrackParam",
                  "name": "\"" + $scope.Parameters.probtrackParam + "\""
              }
          ],
          "inputs": [
              {
                  "name": $scope.Parameters.Files.DWI.name
              },
              {
                  "name": $scope.Parameters.Files.T1.name
              },
              {
                  "name": $scope.Parameters.Files.BrainMask.name
              },
              {
                  "name": $scope.Parameters.Files.parcellationTable.name
              },
              {
                  "name": $scope.Parameters.Files.innerSurface.name
              }
          ],
          "outputs": [
              {
                  "type": "file",
                  "name": $scope.Parameters.subject + "/Network_overlapping_loopcheck/fdt_network_matrix"
              },
              {
                  "type": "file",
                  "name": $scope.Parameters.subject + "/" + $scope.Parameters.Files.parcellationTable.name
              },
              {
                  "type": "file",
                  "name": "stdout.out"
              },
              {
                  "type": "file",
                  "name": "stderr.err"
              }
          ],
          "jobparameters" : [
              {
                  flag: "-N",
                  name: "1"
              },
              {
                  flag:"-t",
                  name: "10-00:00:00"
              },
              {
                  flag: "--mem",
                  name: "20"
              },
              {
                  flag: "-p",
                  name:  $scope.serverselect && $scope.serverselect.queue && $scope.serverselect.queue.name? $scope.serverselect.queue.name : "general"
              }
          ],
          "userEmail": $scope.user.email
      };  


      //Create Job   
      // clusterpostService.createJob(job)
      // .then(function(res){
      //   //Upload data
      //   var doc = res.data;
      //   var val = $scope.readFilesAndSubmit(doc.id); 
      // })
      // .catch(function(e){
      //   console.log(e);
      // });

      var filesArray = _.map($scope.Parameters.Files);
      clusterpostService.createAndSubmitJob(job, _.pluck(filesArray, 'name'), filesArray)
      .catch(function(e){
        console.log(e);
      });
   };

  $scope.submitJobX = function(jobid,force){
    clusterpostService.submitJob(jobid,force).then(function(res){
        console.log("Job " + jobid + " submit");
        $scope.submitTractoButton = false;
        $scope.jobSumitConfirmation.push("Job " + $scope.Parameters.subject + " is created and is running.");
    })
    .catch(function(e){
      $scope.submitTractoButton = false;
      $scope.jobSumitConfirmation.push("Job " + $scope.Parameters.subject + " is created but it's not running. \n --Try to restart the job in the Jobs summary view");
      console.error(e);
      throw e;
    });
  };

    $scope.uploadFiles = function(jobid, keys, index){
      return  clusterpostService.addAttachment(jobid, $scope.Parameters.Files[keys[index]].name, $scope.Parameters.Files[keys[index]])
      .then(function(res){
        if(index < keys.length - 1)
        {
          return $scope.uploadFiles(jobid, keys, index+1);
        }
        else
        {
          //
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

