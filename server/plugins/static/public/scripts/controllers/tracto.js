
angular.module('brainConnectivity')
.controller('tractography', ['$scope','$http','probtrack', 'fileUpload','clusterpost' , function($scope, $http, probtrack, fileUpload, clusterpost) {

	$scope.formOK = false;
	$scope.serverselect = {
		selection : null,
		nbSubmit : 0
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
   	  clusterpost.getExecutionServers().then(function(res){
   		var servers = res.data;
   		_.each(servers, function(server){

   			//First request 
   			if($scope.serverselect.nbSubmit <= 0)
   			{
   				d3.select(".serverSelect").append("option")
   				.attr("value",server.name)
   				.text(server.name);
   				$scope.serverselect.nbSubmit ++;
   			}
   			//After select one server -- do not add once again option in select tag
   			else if ($scope.serverselect.nbSubmit > 0 && d3.select(".serverSelect").filter(function()
   			{
   				return $(this).val() == server.name;
   			}).length <= 0)
   			{
					d3.select(".serverSelect").append("option")
   				.attr("value",server.name)
   				.text(server.name);
   			}   			
 		
 			});
 		});
      if($scope.serverselect.selection == "" || $scope.serverselect.selection == null)
      {
          alert("No server specified - you must choose one server to run a job on it");
      }
      else
      {
          job.executionserver = $scope.serverselect.selection;

      }
   		
		//console.log(job);

   			//console.log(serversAvail);
   			//console.log();
   			//console.log(serversAvail.$$state);
   			//console.log(serversAvail.state);
   		/*_.each(serversAvail, function(server){
   			
   			_.each(server, function(s){
   					console.log(s);
   			})

   			console.log(server);
   		})*/

/*		console.log(job);
    var sol = clusterpost.createJob(job);
    console.log(JSON.stringify(sol));*/

      
    clusterpost.createJob(job)
      	.then(function(res){

          console.log("TOP");
      		//Upload data
      		console.log(res.data);
      		var doc = body;
			    var params = [];

			for(var i = 0; i < inputs.length; i++){
				params.push({
					filename: inputs[i],
					id: doc.id
				});
			}
			console.log(params);
      		console.log("HELLO");
      	//console.log(res.data);
      })
      .catch(function(e)
          {
            console.log(e);
            var error_msg = e.data.message;
            //ar msgPARSE = JSON.parse(error_msg);
            //console.log(msgPARSE);
            console.log(e.data.message);
          });
      console.log(job);
      

      return job;

 } 

 const uploadfile = function(params){

	var filename = params.filename;
	var id = params.id;

	return new Promise(function(resolve, reject){

        try{
            var options = {
                url : "http://localhost:8180/dataprovider/" + id + "/" + path.basename(filename),
                method: "PUT",
                headers:{
                    "Content-Type": "application/octet-stream"
                }
            }

            var stream = fs.createReadStream(filename);

            stream.pipe(request(options, function(err, res, body){
                    if(err) resolve(err);
                    
                    resolve(body);
                    
                })
            );
        }catch(e){
            reject(e);
        }

	});
}

   
}]);


