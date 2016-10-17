exports.register = function (server, options, next) {
	server.path(__dirname);
	
	server.route({
		path: '/',
		method: '*',
		handler: function (request, reply) {
			reply.redirect('/civility/');
		}
	});
	
	server.route({
		path: '/civility/{path*}',
		method: 'GET',
		config: {
			handler: {
				directory: { path: './civility-public', listing: false, index: true }
			},
			description: 'This route serves the static website of CIVILITY. Everything inside the plugins src/CIVILITY-PUBLIC/ directory will be directly accessible under this route.'
		}
	});
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
