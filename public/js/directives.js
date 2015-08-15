'use strict';

/* Directives */

app.directive('onKeyupFn', ['$http', function($http) {
  return function(scope, elm, attrs) {
        //Evaluate the variable that was passed
        //In this case we're just passing a variable that points
        //to a function we'll call each keyup
        var keyupFn = scope.$eval(attrs.onKeyupFn);
        elm.bind('keyup', function(evt) {
          var word = elm.context.value;
            elm.context.style.background = '#FFFFFF';
            if(/[^\s]/.test(word) && word != scope.lookup) //if word is whitespace or same as before
            {
              setTimeout(function(){
                if(word === elm.context.value)
                {
                  $http.get('/api/word/'+word).
                  then(function(response) {
                    var data = response.data
                    if(data.error)
                      elm.context.style.background = '#FF9494';
                    else
                    {
                      scope.pre = "";
                      scope.lookup = word;
                      scope.lookuparr = data
                    }
                  }, function(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
                }
              }, 200);
            }
          });
};
}]);