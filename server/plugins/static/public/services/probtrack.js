angular.module('brainConnectivity')
.factory('probtrack',function($q, $http, $location){

	return{
		getConnectivityDescription: function(id){
			return $http({
				method : 'GET',
				url:'/probtrackConnectivityDescription'

			});
		},
		getMatrix: function(){
			return $http({
			  method: 'GET',
			  url:'/probtrackMatrix'
			});
		},
		getFDTMatrix: function(){
			return $http({
			  method: 'GET',
			  url:'/probtrackFDTMatrix'
			});
		}
			
	};

});