var clusterpost = require("clusterpost-lib");
var path = require('path');
var os = require('os');
var argv = require('minimist')(process.argv.slice(2));
var Converter=require("csvtojson").Converter;
var fs=require('fs');
var _=require('underscore');
var Promise = require('bluebird');
var csvtojson = require('csvtojson');


var help = function(){
    console.error("help: To execute the program you must provide a csv file with columns 'name,dwi,t1,mask,table,surface,surface_color,labelname,ignore_label,overlapping,loopcheck,create_tar'")
    console.error(process.argv[0], process.argv[1], "--csv <csvfilename>");
    console.error("--execution_server <default killdevil>");
    console.error("--queue <default fortnight>");
    console.error("--email <default None, to set the jobs email (for admin only users)>");
}

if(!argv["csv"]){
    help();
    process.exit(1);
}

var readCSV = function(filename){
    return new Promise(function(resolve, reject){
        var objarr = [];
        csvtojson()
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

var agentoptions = {
    rejectUnauthorized: false
}

clusterpost.setAgentOptions(agentoptions);

clusterpost.start(path.join(os.homedir(), '.civility.json'))
.then(function(){
    return clusterpost.getUser();
})
.then(function(res){

    return readCSV(argv["csv"])
    .then(function(civility_csv_arr){
        
        return Promise.map(civility_csv_arr, function(civility_params){
            var inputfiles = [];
            inputfiles.push(civility_params['dwi']);
            inputfiles.push(civility_params['t1']);
            inputfiles.push(civility_params['mask']);
            inputfiles.push(civility_params['table']);
            inputfiles.push(civility_params['surface']);
            if(civility_params['surface_color']){
                inputfiles.push(civility_params['surface_color']);
            }
            
            var job = {
                "type": "job",
                "name": civility_params['name'],
                "executable": "tractographyScriptAppv2.0.sh",
                "parameters": [
                    {
                        "flag": "--subject",
                        "name": civility_params['name']
                    },
                    {
                        "flag": "--dwi",
                        "name": path.basename(civility_params['dwi'])
                    },
                    {
                        "flag": "--t1",
                        "name": path.basename(civility_params['t1'])
                    },
                    {
                        "flag": "--mask",
                        "name": path.basename(civility_params['mask'])
                    },
                    {
                        "flag": "--table",
                        "name": path.basename(civility_params['table'])
                    },
                    {
                        "flag": "--surface",
                        "name": path.basename(civility_params['surface'])
                    },
                    {
                        "flag": "--label_name",
                        "name": civility_params['labelname']
                    },
                    {
                        "flag": "--bedpostxParam",
                        "name": '-n 2'
                    },
                    {
                        "flag": "--probtrackParam",
                        "name": '-P 3000 --steplength=0.75 --sampvox=0.5'
                    }
                ],
                "inputs": [
                    {
                        "name": path.basename(civility_params['dwi'])
                    },
                    {
                        "name": path.basename(civility_params['t1'])
                    },
                    {
                        "name": path.basename(civility_params['mask'])
                    },
                    {
                        "name": path.basename(civility_params['table'])
                    },
                    {
                        "name": path.basename(civility_params['surface'])
                    }
                ],
                "outputs": [
                    {
                        "type": "file",
                        "name": "stdout.out"
                    },
                    {
                        "type": "file",
                        "name": "stderr.err"
                    },
                    {
                        "type": "file",
                        "name": civility_params['name'] + "/Network_overlapping_loopcheck/fdt_network_matrix"  
                    },
                    {
                        "type": "file",
                        "name": civility_params['name'] + "/" + civility_params['table'];
                    }
                ],
                "jobparameters" : [
                    {
                        flag: "-n",
                        name: "1"
                    },
                    {
                        flag:"-R",
                        name: "span[hosts=1]"
                    },
                    {
                        flag: "-M",
                        name: "10"
                    }, 
                    {
                        flag: "-q",
                        name:  argv["queue"]? argv["queue"] : "fortnight"
                    }
                ],
                "userEmail": argv["email"]? argv["email"] : res.email
            };

            if(civility_params['surface_color']){
                job.parameters.push({
                    "flag": "--extra_surface",
                    "name": path.basename(civility_params['surface_color'])
                })
            }

            if(civility_params['ignore_label']){
                job.parameters.push({
                    "flag": "--ignore_label",
                    "name": civility_params['ignore_label']
                })
            }

            if(civility_params['overlapping']){
                job.parameters.push({
                    "flag": "--overlapping",
                    "name": civility_params['overlapping'].toUpperCase() == "TRUE"? "true": "false"
                });    
            }

            if(civility_params['loopcheck']){
                job.parameters.push({
                    "flag": "--loopcheck",
                    "name": civility_params['loopcheck'].toUpperCase() == "TRUE"? "true": "false"
                })
            }else{
                job.parameters.push({
                    "flag": "--loopcheck",
                    "name": "true"
                })
            }

            if(civility_params['create_tar'].toUpperCase() == "TRUE"){
                job.outputs.push({
                        "type": "tar.gz",
                        "name": "./"
                });
            }

            job.executionserver = argv["executionserver"]? argv["executionserver"] : "killdevil";

            console.log("Submitting job:" job);

            return clusterpost.createAndSubmitJob(job, inputfiles);
        }, {concurrency: 1});
    });
})
.then(function(){
    process.exit(0);
})
.catch(console.error)
