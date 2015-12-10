var Hapi = require('hapi');
var Good = require('good');
var fs = require('fs');

var env = process.env.NODE_ENV;

if(!env) throw "Please set NODE_ENV variable.";

var conf = require('./conf.' + env + '.json');

var server = new Hapi.Server();
server.connection({ 
    host: conf.host,
    port: conf.port
});

var plugins = [];

Object.keys(conf.plugins).forEach(function(pluginName){
    var plugin = {};
    plugin.register = require(pluginName);
    plugin.options = conf.plugins[pluginName];
    plugins.push(plugin);
});

plugins.push({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', response: '*' }]
        }]
    }
});

server.register(plugins, function(err){
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});