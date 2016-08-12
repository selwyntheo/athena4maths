angular.module('athena')
  .controller('LoginCtrl', function($scope, $window, $location, $rootScope, $auth) {


    $scope.emailLogin = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function(response) {
          console.log('success');
                    
          $window.localStorage.currentUser = JSON.stringify(response.data.user);

          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
          console.log($rootScope.currentUser);
          
          $location.path('/dashboard');
        })
        .catch(function(response) {
          $scope.errorMessage = {};
          angular.forEach(response.data.message, function(message, field) {
            $scope.loginForm[field].$setValidity('server', false);
            $scope.errorMessage[field] = response.data.message[field];
          });
        });
    };

  });