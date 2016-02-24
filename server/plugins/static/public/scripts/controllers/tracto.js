

angular.module('brainConnectivity')
.controller('tractography', ['$scope','$http','probtrack', function($scope, $http, probtrack) {

	  $scope.plotParameters = {};
	 $scope.parametersTracto = {};

   $scope.FileList = {
      "DWI" : "",
      "DTI" : "",
      "BrainMask":"",
      "JSON": "",
      "SURFACE": "",
      "COLORSURF": ""
  }
 
  $scope.submit = function(){

    probtrack.getFDTMatrix()
    .then(function(response){
      $scope.ButtonClicked = true;
      $scope.plotParameters.link1 = "";
      $scope.plotParameters.link2 = "";
      $scope.plotParameters.threshold = 0.1;
      $scope.plotParameters.method = [true,false,false];
      $scope.plotParameters.tension = 85;
      $scope.plotParameters.diameter = 960
      $scope.plotParameters.upperValue = 1;
      $scope.plotParameters.data = response.data;
      $scope.Plot;
    }).catch(console.error);

  };

  $scope.paramSubmitJob = function()
  {
    $scope.parametersTracto = {};

    console.log("Submit");
    $scope.getSubjectID();

    //Upload reauired files 
    $scope.uploadFilesList();

    $scope.getLabelsetName();
    $scope.ignoreLabel();
   // console.log("Overlapping " + $scope.overlapping);
    // $scope.parametersTracto.overlapping = $scope.overlapping;
   // console.log("Loopcheck " + $scope.loopcheck);
    //  $scope.parametersTracto.loopcheck = $scope.loopcheck;
    $scope.parametersTracto.overlapping = $scope.overlapping;
    $scope.parametersTracto.loopcheck = $scope.loopcheck;
   // $scope.createJobObject();


    console.log("END ");
    console.log($scope.parametersTracto);

  };


  $scope.getSubjectID = function()
  {
    console.log("subject ID : " + $scope.subjectID.id);
    if($scope.subjectID.id)
    {
        $scope.parametersTracto.subjectID = $scope.subjectID.id;
    }
    else
    {
      alert ("You must choose a subject ID ");
    }

  };

  $scope.getLabelsetName = function()
  {
    console.log("labelset name : "+ $scope.labelset.name);
    $scope.parametersTracto.labelSet = $scope.labelset.name;
  };

    $scope.ignoreLabel = function()
  {
      $scope.parametersTracto.ignoreLabel = $scope.checkedIgnoreLabel;
      if($scope.checkedIgnoreLabel)
      {
         $scope.parametersTracto.ignoreLabel = $scope.labelNameIgnore.name;
      }
      else
      {
        $scope.parametersTracto.ignoreLabel = "";
      }
  };



   $scope.subjectID = {
        id: 'neonate'
      };

     $scope.overlapping = {
        overlapping : true
      };

    $scope.loopcheck = {
        loopcheck : true
      };

      $scope.labelNameIgnore = {
        name: "0 0 0"
      };

  $scope.labelset = {
        name: 'colour'
      };

  $scope.uploadFilesList = function(){
      console.log($scope.FileList);
      for (var key in $scope.FileList) {
      console.log(key + " - "  + $scope.FileList[key]);
      if(!$scope.FileList[key] )
        {
          if( key=="COLORSURF"  && $scope.checkedSurfaceColored)
          {
            //Do nothing 
          }
          else
          {
            alert("You must select a " + key +" file for run Tractogrpahy");
          }      
        }
     
      } 
   };



 /*  $scope.createJobObject = function(){
      var job = {};

      job.executable = "TractograpyhWorkflow"; 

      var nbParameters = 4; 


      job.parameters = [];
      for (var i = 0 ; i < nbParameters ; i++)
      {
        var param = {}; 
        param.flag = "";
        param.name = $scope.parametersTracto[i]
         job.parameters.push(param);
      }

      job.type = "job"; 
      job.userEmail = "danaele@email.unc.edu";
      job.executionserver =  "testserver";
   

      console.log(job);
      return job;


/*    var job = {
    "executable": "convert",
    "parameters": [
        {
            "flag": "",
            "name": "pic.jpg"
        },
        {
            "flag": "",
            "name": "pic.eps"
        }
    ],
    "inputs": [
        {
            "name": "pic.jpg"
        }
    ],
    "outputs": [
        {
            "type": "file",
            "name": "pic.eps"
        }
    ],
    "type": "job",
    "userEmail": "juanprietob@gmail.com",
    "executionserver" : "testserver"
};*/


/*  } */

   function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    var targ = evt.target;
    var IdFile = targ.id;
    console.log(IdFile);

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
        var contents = e.target.result;
    /*    alert( "Got the file.n" 
              +"name: " + f.name + "n"
              +"type: " + f.type + "n"
              +"size: " + f.size + " bytesn"
              + "starts with: " + contents.substr(1, contents.indexOf("n"))
        );  */
      }
      r.readAsBinaryString(f);
      if(!$scope.checkedSurfaceColored)
      {
        $scope.FileList[IdFile] = f.name;
      }
      else
      {
       if(IdFile == "COLORSURF")
       {
         $scope.FileList[IdFile] = $scope.FileList["SURFACE"];
       }
       else
       {
        $scope.FileList[IdFile] = f.name;
       }
      }

    } else { 
      alert("Failed to load file");
    }
  }

document.getElementById('DWI').addEventListener('change', readSingleFile, true);
document.getElementById('DTI').addEventListener('change', readSingleFile, false);
document.getElementById('BrainMask').addEventListener('change', readSingleFile, false);
document.getElementById('JSON').addEventListener('change', readSingleFile, false);
document.getElementById('SURFACE').addEventListener('change', readSingleFile, false);
document.getElementById('COLORSURF').addEventListener('change', readSingleFile, false);

 


}]);


