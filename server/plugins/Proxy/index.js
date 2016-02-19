
exports.register = function (server, options, next) {
	require('./proxy.routes')(server,options);    
        
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};