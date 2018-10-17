var _ = require('underscore');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var fs = require('fs');
var csvtojson = require('csvtojson');
var Promise = require('bluebird');

var help = function(){
	console.error("Usage:");
	console.error(process.argv[0], process.argv[1],  "--fdt <fdt_matrix filename>");
	console.error("Options:");
	console.error("--out", "<output filename, default: <fdt_matrix filename>_normalized");
	console.error("--no_triangular", "do not triangulate/symmetrize the matrix");
	process.exit(1);
}

var readCSV = function(filename){

    return new Promise(function(resolve, reject){
        var objarr = [];
        var options = {
        	noheader:true,
        	delimiter:  [",","\t","  "],
        	ignoreEmpty: true
        };
        csvtojson(options)
        .fromFile(filename)
        .on('json', function(jsonObj){
            objarr.push(jsonObj);
        })
        .on('end', function(){
            resolve(objarr);
        })
        .on('error', function(err){
            reject(err);
        })
    });
}

var readFile = function(filename){
	return new Promise(function(resolve, reject){
		var matrix = [];
		var data = fs.readFileSync(filename).toString();
		var lines = data.split('\n');
		      
		//GET MATRIX    
		for(var line = 0; line < lines.length; line++){      
			var rows = [];
			var values = lines[line].split('  ');
			for(var val = 0; val < values.length; val++){
				if(values[val] != ""){
					rows.push(Number(values[val]));
				}           
			}
			if(rows.length>0)
			{
				matrix.push(rows);
			}
		}

		var testlength = false;
		for(var line in matrix){
			if(matrix.length != matrix[line].length)
			{
				testlength = true;
			}
		}

		if(testlength){
			reject("Error dimension matrix");
		}else{
			resolve(matrix);
		}
		
	})
	
}

var triangulateMatrix = function(matrix){
	mat = _.clone(matrix);
	for(var i = 0; i < matrix.length; i++){
		for(var j = i; j < matrix[i].length; j++){
			var avg = (matrix[i][j] + matrix[j][i])/2.0;
			mat[i][j] = avg; 
			mat[j][i] = avg;
		}
	}
	return Promise.resolve(mat);
}

var normalizeMatrix = function(matrix){
	return new Promise(function(resolve, reject){
		try{
			var waytotal = [];
			var matrix_norm = [];
			for(var i in matrix){
				var sum = 0.0;
				for(var j in matrix[i]){
					sum = sum + matrix[i][j];
				}
				waytotal.push(sum);
			}

		    for(var i in matrix)
		    {
		    	var vals = [];
		    	for(var j in matrix[i])
		    	{
		    		vals.push(matrix[i][j]/waytotal[i]);
		    	}
		    	matrix_norm.push(vals);
		    }
		    resolve(matrix_norm);
		}catch(e){
			reject(e);
		}
	});
}

var saveMatrix = function(matrix, filename){
	return new Promise(function(resolve, reject){
			
		var strdata = '';
		for(var i in matrix){
			strdata += matrix[i].toString().replace(/,/g, '  ');
			strdata += '\n';
		}

		fs.writeFile(filename, strdata, function(err){
			if(err){
				reject(err);
			}else{
				resolve('Matrix saved to: ' + filename);
			}
		});

		
	})
}

var fdt_matrix_filename = argv["fdt"];
var outfilename = argv["out"];
var h = argv["h"] || argv["help"];
var no_triangular = argv["no_triangular"];

if(!fdt_matrix_filename || h){
	help();
}

readFile(fdt_matrix_filename)
.then(function(matrix){
	return normalizeMatrix(matrix);
})
.then(function(matrix){
	if(!no_triangular){
		return matrix;
	}else{
		return triangulateMatrix(matrix);
	}
	
})
.then(function(matrix_norm){
	if(!outfilename){
		if(path.extname(fdt_matrix_filename) != ''){
			outfilename = fdt_matrix_filename.replace(path.extname(fdt_matrix_filename), "_normalized" + path.extname(fdt_matrix_filename));
		}else{
			outfilename = fdt_matrix_filename + "_normalized";
		}
		
	}
	return saveMatrix(matrix_norm, outfilename);
})
.then(function(res){
	console.log(res);
	process.exit(0);
})
.catch(function(err){
	console.error(err);
	process.exit(1);
})


	  //     var lines = data.split('\n');
	      
	  //      //GET MATRIX    
	  //      for(var line = 0; line < lines.length; line++){      
	  //      	var rows = [];
	  //      	var values = lines[line].split('  ');
	  //      	for(var val = 0; val < values.length; val++){
	  //      		if(values[val] != ""){
	  //      			rows.push(values[val]);
	  //      		}           
	  //      	}
	  //      	if(rows.length>0)
	  //      	{
	  //      		matrix.push(rows);
	  //      	}
	  //      }

	  //      for(var line in matrix){
			// 	if(matrix.length != matrix[line].length)
			// 	{
			// 		console.log("Error dimension matrix");
			// 		error = true;
			// 	}
	  //      }


	  //      var waytotal = [];
			// //Matrix Normalization  
			// for(var i in matrix)
			// {
			// var sum = 0.0;
			// for(var j in matrix[i])
			// {
			// sum = sum + parseFloat(matrix[i][j]);
			// }
			// waytotal.push(sum);
			// }

   //          for(var i in matrix)
   //          {
   //          	var vals = [];
   //          	for(var j in matrix[i])
   //          	{
   //          		vals.push(parseFloat(matrix[i][j])/waytotal[i]);
   //          	}
   //          	matrix_norm.push(vals);
   //          }
		            