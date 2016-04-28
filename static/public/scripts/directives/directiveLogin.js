
angular.module('brainConnectivity')
.directive('testDir', function($routeParams,$location,clusterpost){

function link($scope,$attrs,$filter){

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

