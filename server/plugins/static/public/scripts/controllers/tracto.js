
angular.module('brainConnectivity')
.controller('tractography', ['$scope','$http','probtrack', 'fileUpload','clusterpost' , function($scope, $http, probtrack, fileUpload, clusterpost) {

	$scope.formOK = false;
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
      ignoreLabelID : "set labelID",
      overlapping: true,
      loopcheck: true
      }

  $scope.data = ["DWI", "T1", "BrainMask", "JSON", "innerSurface", "colorSurface"]
  $scope.params = [];
  $scope.paramSubmitJob = function()
  {
    console.log("Submit");
    $scope.formOK = $scope.formValidation();
    console.log("Valid",$scope.formOK);
    if($scope.formOK == true)
    {
        $scope.Parameters.overlapping = $scope.overlapping;
        $scope.Parameters.loopcheck = $scope.loopcheck;
        $scope.createJobObject();
    }

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
    	$scope.Parameters.ignoreLabelID = "set labelID";
    }
    return true;
    

  };

/* $scope.uploadFile = function(){
        var file = $scope.DWI;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/fileUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };*/

    /*$scope.addAttachment = function(id, array, index){
      var i = index;
      var stream = fs.createReadStream(params[index].filename);

      stream.pipe(request(options, function(err, res, body){
          if(err) resolve(err);
          resolve(body);
             })
          );

      return clusterpost.addAttachment(id, array[i], data)
      .then(function(res){
        if(index < array.length){
          return $scope.addAttachment(id, filename2, index+1);
        }
        return "ok";
      })
    }*/

  clusterpost.getExecutionServers().then(function(res){
    $scope.serverselect.servers = res.data;
    // _.each(servers, function(server){

    //   //First request 
    //   if($scope.serverselect.nbSubmit <= 0)
    //   {
    //     d3.select(".serverSelect").append("option")
    //     .attr("value",server.name)
    //     .text(server.name);
    //     $scope.serverselect.nbSubmit ++;
    //   }
    //   //After select one server -- do not add once again option in select tag
    //   else if ($scope.serverselect.nbSubmit > 0 && d3.select(".serverSelect").filter(function()
    //   {
    //     return $(this).val() == server.name;
    //   }).length <= 0)
    //   {
    //     d3.select(".serverSelect").append("option")
    //     .attr("value",server.name)
    //     .text(server.name);
    //   }         
  
    // });
   });

   $scope.createJobObject = function(){
      var job = {};

      job.executable = "TractograpyhWorkflow"; 

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
      var param = {}; 
      param.type = "file";
      param.name = "output.jpg";
      job.outputs.push(param);

      job.type = "job"; 
      job.userEmail = "danaele@email.unc.edu";
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

    $scope.params = [];
    var job_id = "";  
    clusterpost.createJob(job)
  	.then(function(res){

      console.log($scope.Parameters.Files);
  		//Upload data
  		console.log(res.data);
  		var doc = res.data;
      job_id = doc.id;
     
      $scope.readFiles(doc.id);
    })
    .catch(console.log);
       
      

      return job;

 }

  $scope.uploadPromise = function(jobid, file){
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onloadend = function(e) {
        //upload file        
        clusterpost.addAttachment(jobid, file.name, reader.result)
        .then(function(res){
          resolve(res);
        })
        .catch(reject);        
      }

      reader.readAsArrayBuffer(file);
    });
  }

  $scope.reader = function(jobid, keys, index){
    
    return $scope.uploadPromise(jobid, $scope.Parameters.Files[keys[index]])
    .then(function(res){
      if(index < keys.length - 1){
        return $scope.reader(jobid, keys, index+1);
      }else{
        return 'Done';
      }
    })
    .catch(function(e){
      console.log(e);
    });
  }

  $scope.readFiles = function(jobid){
    
    var keys = _.keys($scope.Parameters.Files);

    $scope.reader(jobid, keys, 0)
    .then(function(res){
      console.log(res);
    });
  }  


}]);


