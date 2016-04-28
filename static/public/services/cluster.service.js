angular.module('brainConnectivity')
.factory('clusterpost', function ($q, $http, $location) {
  return {
    getExecutionServers: function () {
      return $http({
        method: 'GET',
        url: '/executionserver'
        
      });
    },
    getJobStatus: function (id) {
      return $http({
        method: 'GET',
        url: '/executionserver/' + id       
      });
    },
    submitJob: function (id) {
      return $http({
        method: 'POST',
        url: '/executionserver/' + id
      });
    },
    killJob: function (id) {
      return $http({
        method: 'DELETE',
        url: '/executionserver/' + id
        
      });
    },
    createJob: function(job){
      return $http({
        method: 'POST',
        url: '/dataprovider',
        data: job
        
      });
    },
    updateJob: function(job){
    	return $http({
        method: 'PUT',
        url: '/dataprovider',
        data: job
        
      });
    },
    getJob: function(id){
    	return $http({
        method: 'GET',
        url: '/dataprovider/' + id        
      });
    },
    getAttachment: function(id, filename,responseType){
    	return $http({
        method: 'GET',
        url: '/dataprovider/' + id + '/' + encodeURIComponent(filename),
        responseType: responseType
      });
    },
    addAttachment: function(id, filename, data){
    	return $http({
        method: 'PUT',
        url: '/dataprovider/' + id + '/' + filename,
        data: data
        
      });
    },
    getJobUser: function(email, jobstatus, executable){
    	return $http({
        method: 'GET',
        url: '/dataprovider/user',
        params: {
        	userEmail: email, 
        	jobstatus: jobstatus,
        	executable: executable
        }        
      });
    },
    deleteJob: function(id){
       return $http({
         method: 'DELETE',
         url: '/dataprovider/' + id
       })
    },
    createUser: function(user){
      return $http({
        method: 'POST',
        url: '/clusterauth/user',
        data: user
      });
    }
  }
});