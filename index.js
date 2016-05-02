var clusterpostserver = require('clusterpost-server');


var plugin = {};
    plugin.register = require("./static");
    plugin.options = {};


clusterpostserver.server.register(plugin);

clusterpostserver.server.start(function () {
    clusterpostserver.server.log('info', 'Server running at: ' + clusterpostserver.server.info.uri);
});