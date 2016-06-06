var clusterpostserver = require('clusterpost-server');


var plugin = {};
plugin.register = require("./static");
plugin.options = {};

clusterpostserver.server.register(plugin, function(err){
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    clusterpostserver.server.start(function () {
	   clusterpostserver.server.log('info', 'Server running at: ' + clusterpostserver.server.info.uri);
	});
    
});
