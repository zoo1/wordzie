'use strict';

/* Controllers */

app.controller('MainController', ['$scope', 'wordofday', function($scope, wordofday) { 
  wordofday.success(function(data) { 
    $scope.lookup = data.word;
    $scope.lookuparr = data.defs;
  });
  $scope.pre = "Word of the Day:";
}]);