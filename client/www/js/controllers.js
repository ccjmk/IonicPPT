angular.module('starter.controllers', [])

.controller("HomeCtrl", function($scope, $timeout, $location, HelloWorld,$log){

  HelloWorld.helloWorld().then(function(resp){ $log.log(resp.data.msg)})
  var status = {
    ready: {
      loginButtonText: "Jugar!",
      loginDisabled: false,
    },
    waitingForOponent: {
      loginButtonText: "Esperando oponente",
      loginDisabled: true
    }
  };

  $scope.username = "";
  $scope.status = status["ready"];
  $scope.login = function(){
    $scope.status = status["waitingForOponent"];
    $timeout(function(){
      $location.path("game");
    },2000);
  }
})

.controller('GameCtrl', [ "$scope", "$timeout", "$interval", "socket", function($scope, $timeout, $interval,socket){


  var status = {
    choosing: {

    },
    waitingOponent: {

    },
    showingResult: {

    }
  };


  var player1 = {
    name: "Iñaki",
    points: 2,
    selectElement: "scissors"
  };


  var player2 = {
    name: "Migue",
    points: 3,
    selectElement: "scissors"
  };

  $scope.timeLeft = 0;
  $scope.players = [player1, player2];
  $scope.buttonsDisabled = false;

  $scope.testSocket = function(){
    //debugger;
    socket.get("/helloWorld",function(data){
      console.log(data);

    })
  }

  $scope.doPlay = function(e){
    alert(e);
  }

  $interval(function(){
    $scope.timeLeft += 1;
    //console.log($scope.timeLeft);
    $scope.timeLeft = $scope.timeLeft %1000;
  },16);
}])


.directive('stars', function() {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.range = function(n){
        return new Array(n);
      };
    },
    scope: {
      points: '='
    },
    templateUrl: '/templates/stars.html'
  };
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
