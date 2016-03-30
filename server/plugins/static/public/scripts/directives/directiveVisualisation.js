
angular.module('brainConnectivity')
.directive('connectivityVisualisation', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

  $scope.plotVisible = false ;
  $scope.ButtonClicked = false;
  $scope.plotData = undefined;
  $scope.plotParameters = {};

   $scope.testD = undefined; 

   $scope.nbPlotInit = 0;

  $scope.Files = {
    "json": "",
    "matrix": ""
  };

  $scope.showContentJson = function($fileContent){
        $scope.contentJ = $fileContent;
    };

   $scope.showContentMatrix = function($fileContent){
        $scope.contentM = $fileContent;
    };

    $scope.testTab = function(){

    }
  
  $scope.plotBrainConnectivity = function(){

      $scope.nbPlotInit = $scope.nbPlotInit +1;


      var data =  $scope.contentM ;
      console.log(data);
  
      var lines = data.split('\n');

       //GET MATRIX    
       var matrix = [];
        for(var line = 0; line < lines.length; line++){      
        // console.log(lines[line]);
            var rows = [];
            var values = lines[line].split('  ');
            for(var val = 0; val < values.length; val++){
              if(values[val] != ""){
                  //console.log(values[val]);
                   rows.push(values[val]);
                }           
              }
              if(rows.length>0)
              {
                  matrix.push(rows);
              }
            }

            for(var blabla in matrix)
             {
               //console.log(matrix[blabla]);
               if(matrix.length != matrix[blabla].length)
               {
                  console.log("Error dimension matrix");
               }
             }

                 var matrix_norm = [];
                 var waytotal = [];
                 //Matrix Normalization  
                 for(var i in matrix)
                 {
                    var sum = 0.0;
                    for(var j in matrix[i])
                    {
                        sum = sum + parseFloat(matrix[i][j]);
                    }
                    waytotal.push(sum);
                 }

                 for(var i in matrix)
                 {
                    var vals = [];
                    for(var j in matrix[i])
                    {
                        vals.push(parseFloat(matrix[i][j])/waytotal[i]);
                    }
                    matrix_norm.push(vals);
                 }

                var table =  $scope.contentJ ;
                console.log(table);

                var AALObject = JSON.parse(table);
                //console.log(AALObject);

                var table_Matrix = [];
                var listFDT = [];
                var listVisuOrder = [];
                var coordList = {};
                var MaxvisuOrder = 0;

                for(var i=0 ; i < matrix.length ; i++)
                {
                  listFDT.push({});
                }

                for ( var seed in AALObject)
                {
                  var matrixRow = AALObject[seed]["MatrixRow"];
                  if(matrixRow != "-1")
                  {
                    //console.log(AALObject[seed]["MatrixRow"]);
                    listFDT[matrixRow-1] = AALObject[seed]["VisuHierarchy"] + AALObject[seed]["name"];
                    var visuorder = AALObject[seed]["VisuOrder"];
                    //console.log(visuorder);
                    if(visuorder > MaxvisuOrder )
                    {
                      MaxvisuOrder = visuorder;
                    }
                    table_Matrix.push(AALObject[seed]);
                  }
                  else
                  {
                    //Don't use
                  }
                  
                }
                console.log(MaxvisuOrder);

                for(var i=0 ; i < MaxvisuOrder ; i++)
                {
                  listVisuOrder.push("");
                }
                for ( var seed in table_Matrix)
                {
                  
                  var visuOrder = table_Matrix[seed]["VisuOrder"];
                  if(visuOrder != "-1")
                  {
                    //console.log("hello");
                    var name = table_Matrix[seed]["VisuHierarchy"] + table_Matrix[seed]["name"];
                    console.log("test value ", table_Matrix[seed]["coord"])
                    if(table_Matrix[seed]["coord"] != undefined)
                    {
                      console.log("TEST");
                      var coordX = table_Matrix[seed]["coord"][0];
                      var coordY = table_Matrix[seed]["coord"][1];
                      var coordZ = table_Matrix[seed]["coord"][2];
                      var seedInfo = {"name" : name,  "x": coordX, "y": coordY, "z": coordZ};

                    }
                    else 
                    {
                      var seedInfo = {"name" : name};
                    }
                    listVisuOrder[visuOrder-1] = seedInfo
                    //listVisuOrder[visuOrder-1]=table_Matrix[seed]["VisuHierarchy"] + table_Matrix[seed]["name"];
                  } 
                  else
                  {
                    //Don't use
                  }  
                }

                //console.log("List visu order" + listVisuOrder);
                //console.log("List fdt" + listFDT);

                var NewMat = [];
                matrix_norm.forEach(function(line,i)
                {
                var indexLine = listFDT.indexOf(listVisuOrder[i]["name"])  //1
                if(indexLine != -1)
                {
                  var row=matrix_norm[indexLine];
                  var NewRow =[];
                  row.forEach(function(val,j)
                  {
                    var indexRow = listFDT.indexOf(listVisuOrder[j]["name"]);
                    if(indexRow  != -1)
                    {
                      NewRow.push(row[indexRow]);
                    }      
                  });
                  NewMat.push(NewRow); 
                }                       
             });
            
            console.log("Matrix ordered");
            console.log(NewMat.length);

            var returnJSONobject = {"matrix" : NewMat, "listOrdered" : listVisuOrder}
            console.log(listVisuOrder);
            console.log(returnJSONobject);

            $scope.ButtonClicked = true;
            $scope.plotParameters.link1 = "";
            $scope.plotParameters.link2 = "";
            $scope.plotParameters.threshold = 0.1;
            $scope.plotParameters.method = [true,false,false];
            $scope.plotParameters.tension = 85;
            $scope.plotParameters.diameter = 960
            $scope.plotParameters.upperValue = 1;
            $scope.plotParameters.data = returnJSONobject;
            
            $scope.Plot;
   

  }

  $scope.submit = function(){

    probtrack.getFDTMatrix()
    .then(function(response){
      $scope.ButtonClicked = true;
      $scope.plotParameters.link1 = "";
      $scope.plotParameters.link2 = "";
      $scope.plotParameters.threshold = 0.1;
      $scope.plotParameters.method = [true,false,false];
      $scope.plotParameters.tension = 85;
      $scope.plotParameters.diameter = 960
      $scope.plotParameters.upperValue = 1;
      $scope.plotParameters.data = response.data;
      $scope.Plot;
    }).catch(console.error);

  }



};
return {
    restrict : 'E',
/*    scope: {
      testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveVisualisation.html'
}

});

