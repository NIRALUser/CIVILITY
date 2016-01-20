

angular.module('brainConnectivity')
.controller('firstController', ['$scope','$http','probtrack', function($scope, $http, probtrack) {

// }])

// .directive('circlePlot',function(){
//   return {
//     restrict : 'AEC',
//     templateUrl: 'circle-plot.html'
//   }
// })
  $scope.plotVisible = false ;

  $scope.plotData = undefined;
  $scope.plotParameters = {};

  $scope.submit = function(){

    probtrack.getMatrix()
    .then(function(response){
      $scope.plotParameters.threshold = 0.1;
      $scope.plotParameters.data = response.data;
      $scope.Plot;
    }).catch(console.error);

  }
  

  

  
// probtrack.getConnectivityDescription()
//   .then(function(classes){
// $scope.thresholdSplines = function(){

//             var Newthreshold = $scope.splineThreshold;
//             console.log($scope.splineThreshold);
//       //        var nodes = cluster.nodes(packageHierarchy(classes)),
//       //       links = packageImports(nodes,Newthreshold);
//       //   splines = bundle(links);
//       // var size = sizeMap(nodes,Newthreshold);
//       // console.log(size);
//       // // var nodes = cluster.nodes(packageHierarchy(classes));
//       // //  var links = packageImports(nodes,Newthreshold);
//       // //  var size = sizeMap(nodes,Newthreshold);
//       //  splines = bundle(links);
//       // path.attr("d",  function(d, i) { return line(splines[i]); });   

// }




//   });

// d3.json("data/myOutput.json", function(error, classes) {
//   if (error) throw error;   
// });

 


       


}]);


