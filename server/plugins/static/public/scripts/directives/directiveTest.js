
angular.module('brainConnectivity')
.directive('testDir', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

	$scope.noJobSubmit = function()
    {
      if($scope.listJobs.length == 0)  return true;
      else return false;
    }


  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };

  $scope.model = {
    name: 'Tabs'
  };

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

