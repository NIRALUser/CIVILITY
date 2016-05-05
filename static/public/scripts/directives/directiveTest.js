
angular.module('brainConnectivity')
.directive('testDir', function($routeParams,$location,clusterpost, ngTableParams, $filter, $q){

	function link($scope,$attrs){

		$scope.alljobs = {};

		clusterpost.getAllJobs("tractographyScriptApp.sh")
		.then(function(res){
			$scope.alljobs.jobs = res.data;


			$scope.alljobs.allstatus = [];
      		_.each(_.unique(_.pluck(_.compact(_.pluck(res.data, "jobstatus")), "status")), function(status){
        		$scope.alljobs.allstatus.push({
         			 "id": status,
          			 "title": status
        		});
      		});

      		console.log($scope.alljobs.allstatus)
      		 $scope.alljobs.$allstatus.resolve($scope.alljobs.allstatus);


			$scope.alljobs.tableParams = new ngTableParams(
		    {
				page: 1,
				count: 10,
				sorting: {
            		userEmail: 'asc',
            		timestamp: 'asc'
         		 },
				filter: $scope.jobState
			},
			{
				total : $scope.alljobs.jobs.length,
				getData: function ($defer, params) {					
					var data = $scope.alljobs.jobs;
					if(params.filter()){
						data = $filter('filter')(data, params.filter());
					}
					if (params.sorting()) {
              		data = $filter('orderBy')(data, params.orderBy())
            		}
					data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					$defer.resolve(data);
				}
			});
			

/*		
			$scope.getStatusData =(){
				// var status = [];
				// _.each($scope.alljobs.jobs, function(job){
				// 	status.push({
				// 		id: job.jobstatus.status,
				// 		title: job.jobstatus.status
				// 	});
				// });
				// return $q.when(status);
				$scope.alljobs.$jobstatus = $q.defer();    
	    		return $scope.alljobs.$jobstatus;
			}*/
		});
		
		$scope.jobStates = function(column){
		console.log("HELLO jobstates ")    
			    $scope.alljobs.$allstatus = $q.defer();    
			    return $scope.alljobs.$allstatus;
			  }

		$scope.updateStatus = function(user){
		    clusterpost.getJobStatus(user.id).then(function(res){
	           user.status = res.data.status ; 
	        })
	        .catch(function(e){
	          console.error(e);
	          throw e;
	        })
	    }    


	}

	return {
	    restrict : 'E',
	    link : link,
	    templateUrl: 'views/directives/directiveTest.html'
	}

});

