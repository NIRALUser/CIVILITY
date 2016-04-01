
angular.module('brainConnectivity')
.directive('jobsHome', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

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
