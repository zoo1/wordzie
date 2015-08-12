'use strict';

/* Services */

app.factory('wordofday', ['$http', function($http) { 
  return $http.get('/api/day') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);

// app.factory('wordlist', ['$http', function($http) { 
//   return $http.get('/api/list') 
//             .success(function(data) { 
//               return data; 
//             }) 
//             .error(function(err) { 
//               return err; 
//             }); 
// }]);

app.factory('wordlist', ['$http', '$rootScope', function($http, $rootScope) {
  var words = [];
 
  return {
    getWords: function() {
      return $http.get('api/list').then(function(response) {
        words = response.data;
        $rootScope.$broadcast('SetUserWords',words);
        return words;
      })
    },
    saveBooks: function($params , word, def) {
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'api/list',
        method: "POST",
        data: $params,
      })
        .success(function(response) {
          if(response.success)
          	$rootScope.$broadcast('AppendUserWords',{word : word, def : def});
        });
    }
  };
}]);