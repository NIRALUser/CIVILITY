angular.module('cTRIVIAL')
.directive('newWindow', ['$window', '$compile',
  function($window, $compile) {
    return {
      restrict: 'EA',
      link: function($scope, $element, attr) {
        $element.on('$destroy', function() {
          $scope.window.close();
        });
      },
      controller: function($scope, $element) {
        $scope.window = $window.open('', '_blank');
        angular
          .element($scope.window.document.body)
          .append($compile($element.contents())($scope));
      }
    }
  }
]);