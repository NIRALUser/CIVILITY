

angular.module('brainConnectivity')
.controller('tractography', ['$scope','$http','probtrack', 'fileUpload' , function($scope, $http, probtrack, fileUpload) {

	$scope.plotParameters = {};
	$scope.parametersTracto = {};
    $scope.subjectID = "neonate";
    $scope.overlapping = true;
    $scope.loopcheck = true;
    $scope.labelID = "0 0 0";
	$scope.labelset = "colour";
	$scope.ignoreLabel = false;


   $scope.Parameters = {
   	  "subject" : $scope.subjectID,
   	  "DWI" : "",
      "T1" : "",
      "BrainMask":"",
      "parcellationTable": "",
      "innerSurface": "",
      "colorSurface": "",  
      "labelsetName": $scope.labelset,
      "ignoreLabel": $scope.ignoreLabel,
      "ignoreLabelID" : $scope.labelID,
      "overlapping": $scope.overlapping,
      "loopcheck": $scope.loopcheck
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
    console.log("Submit");
    $scope.getSubjectID();
    $scope.getLabelsetName();
    $scope.getIgnoreLabel();

    $scope.Parameters.overlapping = $scope.overlapping;
    $scope.Parameters.loopcheck = $scope.loopcheck;
     $scope.readFilenamea();
   // $scope.uploadFile();

    console.log("END ");
    console.log($scope.Parameters);

  };


  $scope.getSubjectID = function()
  {
    if($scope.subjectID)
    {
        $scope.Parameters.subject = $scope.subjectID;
    }
    else
    {
      alert ("You must define a valid subject ID (only letters, numbers, \"-\", \"_\" are allowed - no space).");
    }

  };

  $scope.getLabelsetName = function()
  {
  	 if($scope.labelset)
    {
        $scope.Parameters.labelsetName = $scope.labelset;
    }
    else
    {
      alert ("You must define a valid labelset name (only letters, numbers, \"-\", \"_\" are allowed - no space).");
    }
    
  };

    $scope.getIgnoreLabel = function()
  {
      $scope.Parameters.ignoreLabel = $scope.ignoreLabel;
      if($scope.ignoreLabel)
      {
         $scope.Parameters.ignoreLabelID = $scope.labelID;
      }
      else
      {
        $scope.Parameters.ignoreLabelID = "";
      }
  };

  $scope.readFilenamea= function(){

 		//DWI Image
 		if($scope.DWI)
 		{
 			$scope.Parameters.DWI= $scope.DWI.name;
 		}
 		else
 		{
 			alert("You must select DWI file.");
 		}

 		//T1 image
 		if($scope.T1)
 		{
 			$scope.Parameters.T1= $scope.T1.name;
 		}
 		else
 		{
 			alert("You must select T1 file.");
 		}
	
		//Brain mask
		if($scope.BrainMask)
 		{
 			$scope.Parameters.BrainMask= $scope.BrainMask.name;
 		}
 		else
 		{
 			alert("You must select brainmask file.");
 		} 

 		//Parcellation Table
 		if($scope.parcellationTable)
 		{
 			$scope.Parameters.parcellationTable= $scope.parcellationTable.name;
 		}
 		else
 		{
 			alert("You must select parcellation Table file.");
 		} 

 		//Inner Surface
 		if($scope.innerSurface)
 		{
 			$scope.Parameters.innerSurface= $scope.innerSurface.name;
 		}
 		else
 		{
 			alert("You must select inner Surface file.");
 		}

 		//Colored surface
 		if($scope.checkedSurfaceColored  && $scope.innerSurface)
 		{
 			$scope.Parameters.colorSurface = $scope.innerSurface.name;
 		}
 		else if ($scope.checkedSurfaceColored && !$scope.innerSurface)
 		{
 				//Do nothing 
 		}
 		else
 		{
 			if($scope.colorSurface)
 			{
 				$scope.Parameters.colorSurface = $scope.colorSurface.name;
 			}
 			else
 			{
 				alert("You must select an alternative surface file containing color labels.");
 			}
 		}

  	   };

 $scope.uploadFile = function(){
        var file = $scope.DWI;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/fileUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl);
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

   
}]);


