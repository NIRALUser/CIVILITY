var jsonfile = require('jsonfile');
var fs = require('fs');
var Promise = require('bluebird');

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

    handler.getMatrix = function (request, reply)
    {

        var array = ["/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/Average_triangularMatrix.txt", "/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/seedlist.txt"];

        Promise.map(array, readFile)
        .then(function(arrayData){

                var data = arrayData[0];
                var seedname = arrayData[1];

                var seeds = seedname.split('\n');
                var lines = data.split('\n');

                if( seeds.length != lines.length )
                  {
                      console.log("Seeds name list and Matrix file have wrong dimensions");
                  }
                var matrix = [];
                for(var line = 0; line < lines.length; line++){      
        //         console.log(lines[line]);
                     var rows = [];
                     var values = lines[line].split(' ');
                     for(var val = 0; val < values.length; val++){
            //             //console.log(values[val]);
                         rows.push(values[val]);
                     }
            //         console.log(rows.length);
                     if( rows.length != lines.length )
                     {
                         console.log("Matrix dimension wrong");        
                     }
                     matrix.push(rows);
                 }

                 var matrixDescription = [];
                
                var sizeMat = seeds.length;
                for (var nbseed = 0; nbseed<sizeMat; nbseed++)
                {
        //          console.log(seeds[nbseed]);

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
                //var wstream = fs.createWriteStream('/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/myJSONOutput.json');
                //wstream.write(matrixDescription);
                console.log(arrayData);

                reply(matrixDescription);
        })
        .catch(reply);

    };


    handler.getConnectivityDescription = function (request, reply)
    {
        reply("ok");
    }
    return handler; 
    
}