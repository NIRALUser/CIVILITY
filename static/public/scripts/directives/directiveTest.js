
angular.module('brainConnectivity')
.directive('testDir', function($routeParams,$location,clusterpost, ngTableParams){

function link($scope,$attrs,$filter){
var self = this;

clusterpost.getAllJobs("tractographyScriptApp.sh").then(function(res){
	console.log(res.data);
	$scope.jobs = [];
	_.each(res.data, function(val){
		var aJob = {
		status: val.jobstatus.status,
		email : val.userEmail,
		timestamp : val.timestamp,
		id : val._id
		}; 
		$scope.jobs.push(aJob);
	})
	console.log($scope.jobs);
})
.catch(function(e){
	console.error(e);
	throw e;
});

	$scope.tableParams	= new ngTableParams
	({
		page: 1,
		count: 50
	},
	{
		debugMode: true,
		//total:	$scope.completedQueries.length,
		getData:	function($defer, params) {
			var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.completedQueries, params.orderBy()) :
                    data;
      orderedData	= $filter('filterFailed')(orderedData, $scope.showOnlyFailed);
      orderedData	= $filter('filterMatchingKeys')(orderedData, $scope.keysFilter);
            
			params.total(orderedData.length);
			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(),
					                                     params.page() * params.count()));
		}
	});
};

return {
    restrict : 'E',
/*    scope: {
    	testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveTest.html'
}

});

