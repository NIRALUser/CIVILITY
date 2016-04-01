
angular.module('brainConnectivity')
.directive('testDir', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

	$scope.changeData = function()
    {
      for(var i = -1 ; i <= 1 ; i=i+1)
      {
        if(i != 0)
        {
          
        }
      }
    }

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

