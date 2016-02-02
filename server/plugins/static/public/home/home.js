

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
      $scope.plotParameters.tension = 85;
      $scope.plotParameters.diameter = 960
      $scope.plotParameters.upperValue = 1;
      $scope.plotParameters.data = response.data;
      $scope.Plot;
    }).catch(console.error);

  }

  $scope.arrayTest = {};

  $scope.test1 = function(){

    probtrack.getConnectivityDescription()
    .then(function(response){

      $scope.arrayTest=response.data;
      console.log("Hello");
      console.log($scope.arrayTest);

    }).catch(console.error);

  }

    $scope.test2 = function(){

    probtrack.getFDTMatrix()
    .then(function(response){

      $scope.arrayTest = response.data;
      console.log("Hello2");
      console.log($scope.arrayTest);

      var matrix = $scope.arrayTest["matrix"];
      var listOrdered = $scope.arrayTest["listOrdered"];

       var matrixDescription = [];
                
        var sizeMat = matrix.length;
        console.log(sizeMat);
            for (var nbseed = 0; nbseed<sizeMat; nbseed++)
             {
        //    console.log(seeds[nbseed]);

              var jsonLine = {"name": seeds[nbseed] };
              var size = [];
              var imports = [];

              for (var j = 0; j<sizeMat; j++)
               {
                if(j != nbseed )
                 {
                  if(matrix[nbseed][j] > "0")
                   {
                       size.push(parseFloat(matrix[nbseed][j]));
                       imports.push(seeds[j]);
                   }
                  }

                    }

                    jsonLine.size = size;
                    jsonLine.imports = imports;
                    
                
                    matrixDescription.push(jsonLine);
                }



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


