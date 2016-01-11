var jsonfile = require('jsonfile');
var fs = require('fs');

module.exports = function(server,options)
{
    
    var handler = {};
    handler.getMatrix = function (request, reply){
   	 	//console.log("hello");
    	fs.readFile("/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/mat.txt",'utf8',
    		function (error,data){
    	if (error) throw error;
    	//console.log(data);
    	fs.readFile("/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/seedname.txt",'utf8',
    		function (error,seedname){
		if (error) throw error;
    	//console.log(seedname);

    	var seeds = seedname.split('\n');
    	//console.log(seeds);
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
//         {
             console.log("Matrix dimension wrong");
//         }
         matrix.push(rows);
//     }
     
}

    	var wstream = fs.createWriteStream('/Users/danaele_puechmaille/Documents/ProbtrackBrainConnectivity/server/plugins/ProbtrackConnectivity/data/myOutput.txt');
    	wstream.write("[\n");
    	for (var nbseed = 0; nbseed<seeds.length; nbseed++)
    	{
    		console.log(seeds[nbseed]);

    		var jsonLine = {'name': seeds[nbseed] };
    		var size = [];
    		var imports = [];

    		for (var j = 0; j<seeds.length; j++)
    		{
    			if(j != nbseed )
    			{
    				if(matrix[nbseed][j] > 0)
    				{
    					size.push(matrix[nbseed][j]);
    					imports.push(seeds[j]);
    				}
    			}

    		}
    		// if(matrix[nbseed][j] != 0)
    		// {
    		// }

    		jsonLine.size = size;
    		jsonLine.imports = imports;
    		console.log("jsonLine :");
    		console.log(jsonLine);
		
    		var lineTest = JSON.stringify(jsonLine);
    		wstream.write(lineTest+ ",\n");
    	}
    	wstream.write("]");
    	wstream.end();
    	
);

    	wstream.write("[");
		console.log(matrix);  
		console.log("matrix compo : ");
		console.log(matrix[1][1]);  
    	//console.log(lines);
    	reply({name : data, size : seedname, imports : data});
    });
    	});

    	
    }
    return handler; 
    
}