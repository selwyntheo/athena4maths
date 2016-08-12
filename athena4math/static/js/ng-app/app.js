angular.module('athena', ['ngRoute', 'ngMessages', 'ngResource','satellizer'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/quiz', {
        templateUrl: 'views/take-quiz.html',
        controller: 'QuizCtrl'
      })
      .otherwise('/');

    $authProvider.loginUrl = 'http://localhost:5000/auth/login';
    $authProvider.signupUrl = 'http://localhost:5000/auth/signup';
  })
  .run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated()) {
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
  });
