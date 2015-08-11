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