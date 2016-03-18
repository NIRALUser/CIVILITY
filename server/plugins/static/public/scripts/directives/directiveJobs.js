
angular.module('brainConnectivity')
.directive('jobsHome', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

	$scope.hello = function()
    {
      console.log("I'm in DIRECTIVE JOBS")
    }

};
return {
    restrict : 'E',
/*    scope: {
    	testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveJobs.html'
}

});
