
angular.module('brainConnectivity')
.controller('tractographyAppController', ['$scope','$http','probtrack', function($scope, $http, probtrack) {


$scope.tabs = [{
heading : "Tractography",
active : true,
content : ""
},["Jobs done",false],["Visualisation",false],["Compute PCA",false],["Visualisation Animated",false],["TEST",false]]
$scope.setTabTracto = function(){
	
}


}]);

