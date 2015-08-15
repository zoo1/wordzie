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
            if(/[^\s]/.test(word) && word != scope.lookup) //if word is whitespace or same as before
            {
              setTimeout(function(){
                if(word === elm.context.value)
                {
                  $http.get('/api/word/'+elm.context.value).
                  then(function(response) {
                    var data = response.data
                    if(data.error)
                      elm.context.style.background = '#FF9494';
                    else
                    {
                      elm.context.style.background = '#FFFFFF';
                      scope.pre = "";
                      scope.lookup = elm.context.value;
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