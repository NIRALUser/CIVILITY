
exports.register = function (server, options, next) {
	var handlers = require('./probtrack.handler')(server,options);
    server.route({
        method: 'GET',
        path:'/probtrackMatrix',
        handler: handlers.getMatrix
    });
        
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};