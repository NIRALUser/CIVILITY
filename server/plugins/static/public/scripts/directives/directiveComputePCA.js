
angular.module('brainConnectivity')
.directive('computePca', function($routeParams,$location,clusterpost, probtrack){

function link($scope,$attrs,$filter){

    $scope.matrixDimension = 0;


 $scope.param = {};

  $scope.valueK = 0 ;

  $scope.jobsSelectedPCA = [];

  //console.log($scope.jobsSelectedPCA)

  $scope.showContentJson = function($fileContent){
        $scope.contentJ = $fileContent;
    };

$scope.showContentMatrix = function($fileContent){
        $scope.contentM = $fileContent;
    };

	$scope.changeData = function()
    {
    var file_name = "PCAreconstructionSVD_" +  $scope.valueK ;
    }

$scope.addMatrixToList = function(){

      var param = {
        id : "none",
        subject : $scope.param.subjectID,
        type : "matrix added",
        matrix : $scope.contentM
      };

      $scope.jobsSelectedPCA.push(param);
}

$scope.removeFromList = function(job){
    $scope.jobsSelectedPCA.splice( $scope.jobsSelectedPCA.indexOf(job) , 1 );               
}

$scope.readMatrixAsDoubleArray = function(matrix){

    var lines = matrix.split('\n');
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
    return matrix;
}

$scope.normalizedMatrix = function(matrix){

    var waytotal = [];
    var matrix_norm = [];
    for( var k=0 ; k < 2 ; k++ )
    {
        for(var i = 0 ; i < matrix.length ; i++)
        {
            var row = [];

            var total=0;
            var val_norm = 0.0;

            for(var j = 0 ; j < matrix[i].length ; j++)
            {
                if(k==0)
                {
                    total += parseFloat(matrix[i][j]);
                }
                else
                {
                    var val = parseFloat(matrix[i][j]);
                    val_norm = val/waytotal[j];
                    row.push(val_norm);
                }
            }
            if(i == 0){
                var sizeLine = row.length;
            }
            else
            {
                if(row.length != sizeLine)
                {
                    console.error("Matrix error dimension ");
                }
            }
            if(k==0)
            {
                waytotal.push(total);
            }
            else
            {
                matrix_norm.push(row);
            }
        }
        console.log(waytotal);
    }

    console.log(waytotal.length);
    return matrix_norm;





}

$scope.matrixAsVector = function(matrix){

    var vector = [];
    console.log(matrix.length);

    for(var  i=0 ; i < matrix.length ; i++)
    {
        for(var  j=0 ; j < matrix.length ; j++)
        {
        vector.push(parseFloat(matrix[i][j]));
        }
    }
    console.log(vector.length);
    return vector; 
}

$scope.numberOfComponents = function(singularValues){
    
    var  sumEigenValues = 0 ;
    for(var i = 0 ; i < singularValues.length ; i++)
    {
        sumEigenValues += singularValues[i];
    }
   console.log(sumEigenValues);
    var nbCompo = 0;
    var cumulativeVariance = 0 ;
    for(var i = 0 ; i < singularValues.length ; i++)
    {
        nbCompo ++;
        cumulativeVariance  +=  singularValues[i] / sumEigenValues ;
        if(cumulativeVariance > 0.90)
        {
            return nbCompo;
        }
    }
}

$scope.runPCA = function(){

    if($scope.jobsSelectedPCA.length >= 2)
    {
       //Create matrix of all vectors 
    var vectorList = [];
    var matrixList =[];

    _.each($scope.jobsSelectedPCA,function(value,key){

        //Read matrix as double array
        var matrixArray = $scope.readMatrixAsDoubleArray(value.matrix);
        console.log(matrixArray);
        matrixList.push(matrixArray);
    })
    console.log(matrixList);
    var matrixSizeCol =  matrixList[0].length;
    var matrixSizeRow = matrixList[0][0].length

    if(matrixSizeRow != matrixSizeCol ){
        console.error("ERROR Matrix is not square : this is not a brain connectivty matrix");
    }

    //Check all matrix have same dimensions 
    matrixList.forEach(function(value,key){
        if(value.length != matrixSizeCol || value[0].length !=  matrixSizeRow)
        {
            console.error("Matrices don't have the same dimension - Compute PCA failed");
        }
    })


     matrixList.forEach(function(value,key){

        //FNormalized matrix
        var matrixNorm = $scope.normalizedMatrix(value);
        console.log(matrixNorm);
        //Make mastrix a single vector
        var vector = $scope.matrixAsVector(matrixNorm);
        console.log(vector);
        vectorList.push(vector);
    })
    var sizeVector = vectorList[0].length;
    console.log(sizeVector);

    vectorList.forEach(function(vect,i){
        if(vectorList[i].length != sizeVector) console.error("Matrices don't have the same dimension - Compute PCA failed")
    });

    console.log(vectorList.length);
    console.log(vectorList[0].length);

    var datasetTranspose = vectorList;
    console.log(datasetTranspose.length);
    console.log(datasetTranspose[0].length);

    //Mean dataset
    var meanDataset = math.mean(datasetTranspose,0);
    console.log(meanDataset);
    var centerDataset = [];
    for(var i = 0 ; i < vectorList.length ; i++)
    {
        var vect = [];
        var dataVect = datasetTranspose[i];
        for(var j = 0 ; j < sizeVector ; j++)
        {
/*        console.log(datasetTranspose[i][j], meanDataset[j]);
*/           var a = datasetTranspose[i][j] - meanDataset[j];
           vect.push(a);
        }
        centerDataset.push(vect);
    }
    console.log(centerDataset);
    var val = 1 / Math.sqrt( sizeVector - 1 );
   // centerDataset = centerDataset * val;
    var svdRes = numeric.svd(numeric.transpose(centerDataset));
    console.log(svdRes.U.length , svdRes.S.length);
    console.log(numeric.transpose(svdRes.V).length , svdRes.S.length);
    console.log("eigenvalues",svdRes.S);
    var nbCompo = $scope.numberOfComponents(svdRes.S);
    console.log(nbCompo);

    var vectReconstruct = meanDataset;
        for (var k=0 ; k <= 10 ; k++)
        {

            for (var j = 0 ; j < nbCompo ; j++)
            {
                var scalar = k * Math.sqrt(svdRes.S[j]);
                console.log(scalar);
               var newVect = scalar * numeric.transpose(svdRes.V);
               console.log(newVect);
               vectReconstruct += newVect;
            }

            //Delinearize vect 
            var id = 0;
            var matrixReconstruct = [];
            for(var i = 0 ; i < matrixSizeCol ; i++)
            {
                var line = [] ;
                for(var j = 0 ; j < matrixSizeRow ; j++)
                {
                    line.push(vectReconstruct[0]);
                    id ++;
                }
                matrixReconstruct.push(line);
            }
            console.log(matrixReconstruct);
        }
    }
    else
    {
        console.error("Error : List of matrices to compute PCA is empty ");
    }

}


$scope.$watch("valueK", function(){
        console.log("HelloWatch svalue K ", $scope.valueK);
        $scope.changeData();
      });

};

return {
    restrict : 'E',
/*    scope: {
    	testID : "="
    },*/
    link : link,
    templateUrl: 'views/directives/directiveComputePCA.html'
}

});

