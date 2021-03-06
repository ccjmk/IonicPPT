angular.module('starter.services', [])
.factory('socket', ['$rootScope', function ($rootScope) {
    return io.socket;
}])
.factory('_', ['$rootScope', function ($rootScope) {
    return _;
}])
.factory('HelloWorld', function($http) {
  return {
    helloWorld: function(){
      return $http.get("http://localhost:1337/helloWorld");
    }
  }
});
