angular.module('athena')
  .controller('HomeCtrl', function($scope, $window, $rootScope, $auth, API) {

    if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
      
    }

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

 

  });