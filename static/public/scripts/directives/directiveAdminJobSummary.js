
angular.module('brainConnectivity')
.directive('adminJob', function($routeParams,$location,clusterpost, $filter, $q){

	function link($scope,$attrs){


		$scope.updateStatus = function(job){

		    clusterpost.getJobStatus(job._id).then(function(res){
	           job.jobstatus = res.data;
	        })
	        .catch(function(e){
	          console.error(e);
	          throw e;
	        })
	    }    

	    $scope.killJob = function(job){

		    clusterpost.killJob(job._id).then(function(res){
	           job.jobstatus = res.data;
	        })
	        .catch(function(e){
	          console.error(e);
	          throw e;
	        })
	    }
	    $scope.removeRow = function(job) {
	        var index = $scope.rowCollection.indexOf(job);
	        if (index !== -1) {
	            $scope.rowCollection.splice(index, 1);
	        }
    	}   

	   	$scope.removeInDB = function(job){

		    clusterpost.deleteJob(job._id).then(function(res){
		    	$scope.removeRow(job);
	        })
	        .catch(function(e){
	          console.error(e);
	          throw e;
	        })
	    }
	    $scope.runJob = function(job,force){
			clusterpost.submitJob(job._id,force).then(function(res){
				$scope.getDB();
			})
			.catch(function(e){
                console.error(e);
            });
		}

	    $scope.getDB = function(){
			clusterpost.getAllJobs("tractographyScriptApp.sh").then(function(res){
			$scope.rowCollection = res.data;
			})
			.catch(function(e){
                console.error(e);
            });
		}

		$scope.itemsByPage = "10";
		$scope.rowCollection = [];
		$scope.getDB();
		$scope.forceRunJob = false;

	


	}

	return {
	    restrict : 'E',
	    link : link,
	    templateUrl: 'views/directives/directiveAdminJobSummary.html'
	}

});

/*angular.module('brainConnectivity').filter('myStrictFilter', function($filter){
    return function(input, predicate){
        return $filter('filter')(input, predicate, true);
    }
});

angular.module('brainConnectivity').filter('unique', function() {
    return function (arr, field) {
        var o = {}, i, l = arr.length, r = [];
        for(i=0; i<l;i+=1) {
            o[arr[i][field]] = arr[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
    return function (items, attr) {
      var seen = {};
      return items.filter(function (item) {
        return (angular.isUndefined(attr) || !item.hasOwnProperty(attr))
          ? true
          : seen[item[attr]] = !seen[item[attr]];
      });
    };
  })*/