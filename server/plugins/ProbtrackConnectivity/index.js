
exports.register = function (server, options, next) {
	var handlers = require('./probtrack.handler')(server,options);
    server.route({
        method: 'GET',
        path:'/probtrackMatrix',
        handler: handlers.getMatrix
    });

    server.route({
        method: 'GET',
        path:'/probtrackFDTMatrix',
        handler: handlers.getFDTMatrix
    });

     server.route({
        method: 'GET',
        path:'/probtrackConnectivityDescription',
        handler: handlers.getConnectivityDescription
    });
        
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};