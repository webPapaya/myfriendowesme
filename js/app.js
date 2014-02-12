'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider.when('/overview/:id', {
        templateUrl: 'partials/userOverview.html',
        controller: 'UserOverviewController'
    });

    $routeProvider.when('/overview', {
        templateUrl: 'partials/overview.html',
        controller: 'OverviewController'
    });

    $routeProvider.when('/add', {
        templateUrl: 'partials/add.html',
        controller: 'addController'
    });

    $routeProvider.when('/about', {
        templateUrl: 'partials/about.html'
    });

     $routeProvider.otherwise({ redirectTo: '/add' });
}]);

