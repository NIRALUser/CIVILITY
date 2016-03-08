module.exports = function (server, conf) {

  var options = require("./conf." + conf.env + ".json");
  
  server.route({
    path: '/clusterpost/{path*}',
    method: '*',
    config: {
      handler: {
        proxy: {
          redirects: 10,
          mapUri: function(req, callback){            
            var path = req.url.path.replace("/clusterpost", options.clusterpost);
            console.log(path);
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