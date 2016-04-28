angular.module('brainConnectivity')
.factory('probtrack',function($q, $http, $location){

	return{
		getFDTMatrix: function(){
			return $http({
			  method: 'GET',
			  url:'/probtrackFDTMatrix'
			});
		},
		getJSONjob: function(){
			return $http({
			  method: 'GET',
			  url:'data/job.json'
			});
		}			
	};

});