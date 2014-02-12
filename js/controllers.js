'use strict';

angular.module('myApp.controllers', []).
  controller('OverviewController',function($scope, Storage, $location, $route) {
        var debts = Storage.getOverview();

        if(debts.length == 0) {
            $location.path("/add");
        }

        $scope.title = "Debt Overview";
        $scope.debts = debts;

        $scope.delete = function(pID) {
            Storage.bulkRemoveDebts(pID);
            $route.reload();
        };
  })

  .controller('UserOverviewController', function($scope, $location, Storage, $routeParams, Formater, $route) {
        var debts = Storage.getDebtsFromID($routeParams.id);

        $scope.title = Storage.getNameFromID($routeParams.id);
        $scope.timeStamp = Formater.timestampToAgo($scope.timeStamp);

        if(debts.length > 0) {
            $scope.debts = debts;
        } else {
            $location.path("/overview");
        }

        $scope.delete = function(dID) {
            Storage.removeDebt(dID);
            $route.reload();
        }
  })

  .controller('addController', function($scope, Storage, $location) {
        $scope.title = "Add debt";
        $scope.add = function() {
            $scope.debtAmount = $scope.debtAmount.replace(",", ".");

            console.log($scope.debtAmount);
            if(Storage.addDebt($scope.name, $scope.debtAmount, $scope.usage)) {
                console.log("success");
                $location.path("/overview");
            }
        };
  });