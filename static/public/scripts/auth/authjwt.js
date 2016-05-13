angular.module('brainConnectivity', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  // Please note we're annotating the function so that the $injector works when the file is minified
  jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
    myService.doSomething();
    return localStorage.getItem('id_token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
})