

angular.module('brainConnectivity')
.controller('tractography', ['$scope','$http','probtrack', 'fileUpload' , function($scope, $http, probtrack, fileUpload) {

//	$scope.plotParameters = {};
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
      ignoreLabelID : "",
      overlapping: true,
      loopcheck: true
      }
 
/*  $scope.submit = function(){

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

  };*/

  $scope.paramSubmitJob = function()
  {
    console.log("Submit");
    $scope.formValidation();
    $scope.Parameters.overlapping = $scope.overlapping;
    $scope.Parameters.loopcheck = $scope.loopcheck;
    $scope.createJobObject();

    console.log("END ");
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

    //Check label name is specified when ignoreLabel = true 
    if($scope.Parameters.ignoreLabel && !$scope.Parameters.ignoreLabelID)
    {
       alert ("You must specified the name of label to ignore");
       return false;
    }

    //empty string if ignoreLabel = false 
    if(!$scope.Parameters.ignoreLabel)
    {
    	$scope.Parameters.ignoreLabelID = "";
    }
    

  };


/* $scope.uploadFile = function(){
        var file = $scope.DWI;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/fileUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };*/


   $scope.createJobObject = function(){
      var job = {};

      job.executable = "TractograpyhWorkflow"; 

      job.parameters = [];
      _.each($scope.Parameters, function(value, key){
      		if(key != "Files")
      		{
      			var param = {}; 
      			param.flag = "";
      			param.name = value;
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


 } 

   
}]);


