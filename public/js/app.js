'use strict'
var app=angular.module('myApp', []);

app.directive('onKeyupFn', ['$http', function($http) {
    return function(scope, elm, attrs) {
        //Evaluate the variable that was passed
        //In this case we're just passing a variable that points
        //to a function we'll call each keyup
        var keyupFn = scope.$eval(attrs.onKeyupFn);
        elm.bind('keyup', function(evt) {
            console.log(elm.context.value);

            $http.get('/api/word/'+elm.context.value).
  then(function(response) {
    // this callback will be called asynchronously
    // when the response is available
  }, function(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
        });
    };
}]);

function MyCtrl($scope) {
    $scope.keylog = [];
    $scope.keyCount= 0;
    
    $scope.handleKeypress = function(key) {
        $scope.keylog.push(key);
        console.log(key);
    };
}