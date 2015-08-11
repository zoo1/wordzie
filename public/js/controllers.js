'use strict';

/* Controllers */

app.controller('MainController', ['$scope', 'wordofday', function($scope, forecast) { 
  forecast.success(function(data) { 
    $scope.lookup = data.word;
    $scope.lookuparr = data.defs;
  });
}]);