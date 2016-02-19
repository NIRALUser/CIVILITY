module.exports = function (server, conf) {

  server.route({
    path: '/clusterpost/{path*}',
    method: '*',
    config: {
      handler: {
        proxy: {
          redirects: 10,
          mapUri: function(req, callback){
            var path = req.url.path.replace("/clusterpost", conf.clusterpost);
            callback(null, path);
          },
          passThrough: true,
          xforward: true
        }
      },
      description: 'Proxy to the clusterpost application'
    }
  });

};