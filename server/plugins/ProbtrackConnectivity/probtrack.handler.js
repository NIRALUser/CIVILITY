var jsonfile = require('jsonfile');
var fs = require('fs');
var Promise = require('bluebird');
var Papa = require('papaparse');

module.exports = function(server,options)
{
    
    var handler = {};


    var readFile = function(filename){
        return new Promise(function(resolve, reject){
            fs.readFile( filename, 'utf8', function (error, data){
                if (error) reject(error);
                resolve(data);
            });
        });
    }

    handler.getFDTMatrix = function (request, reply)
    {

        //var array = ["/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/fdt_network_matrix", "/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/TABLE_AAL.json"];
        var array = ["/work/danaele/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/fdt_network_matrix_average", "/work/danaele/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/TABLE_AAL.json"];

        Promise.map(array, readFile)
        .then(function(arrayData){

                var data = arrayData[0];
  
                var lines = data.split('\n');

                //GET MATRIX    
                var matrix = [];
                for(var line = 0; line < lines.length; line++){      
        //         console.log(lines[line]);
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

                var table = arrayData[1];

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
                    var coordX = table_Matrix[seed]["coord"][0];
                    var coordY = table_Matrix[seed]["coord"][1];
                    var coordZ = table_Matrix[seed]["coord"][2];
                    var seedInfo = {"name" : name,  "x": coordX, "y": coordY, "z": coordZ};
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
            reply(returnJSONobject);
        })
        .catch(reply);

    };
    return handler; 
    
}