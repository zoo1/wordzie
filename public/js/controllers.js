'use strict';

/* Controllers */

app.controller('MainController', ['$scope', 'wordofday', 'wordlist', function($scope, wordofday, wordlist) { 
	$scope.userlist = [];
  wordofday.success(function(data) { 
    $scope.lookup = data.word;
    $scope.lookuparr = data.defs;
  });
  $scope.pre = "Word of the Day:";

  wordlist.getWords().then(function(data) {
    $scope.userlist = data;
    console.log(data);
  });
 
  $scope.$on('SetUserWords', function(events, words) {
    $scope.userlist = words;
  });

  $scope.$on('AppendUserWords', function(events, word) {
    $scope.userlist.push(word);
    console.log(word);
  });
 
	//adding entry to list when 
  $scope.addtolist = function() {
     var params = $.param({
      "word": $scope.lookup
    })
    wordlist.saveBooks(params, $scope.lookup, $scope.lookuparr);
}
}]);