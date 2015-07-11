angular.module('starter.controllers', [])

.controller("HomeCtrl",["$scope", "$timeout", "$location", "HelloWorld","$log",
  function($scope, $timeout, $location, HelloWorld,$log){
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

  $scope.status = status["ready"];

  $scope.login = function(){
    $scope.status = status["waitingForOponent"];
    $location.path("#game");
  }
}])

.controller('GameCtrl', ["$scope", "$timeout", "$interval", "socket", "$log",
            function($scope, $timeout, $interval, socket, $log){
  //hago request para que me subscriban a un juego

  $scope.game = {};
  $scope.username = "User" + Math.ceil(Math.random()*100);

  socket.post("/helloWorld/subscribeToGame",
    {name: $scope.username },
    function(data){
    $scope.$apply(function(){
        $log.log(data);
        $scope.game = data;
    });
  });
  // $scope.timeLeft = 0;
  // $scope.players = [];
  // $scope.buttonsDisabled = false;

//Llamada al controller para entrar a un juego


//Evento de updateGame
  socket.on("game", function(data){
    $scope.$apply(function(){
        $log.log(data);
        $scope.game = data.data;
    });
  });

  $scope.doPlay = function(e){

    if($scope.game && $scope.game.players)
    {
      for(var i=0;i<$scope.game.players.length;i++)
      {
        if($scope.game.players[i].name == $scope.username)
        {
          $scope.game.players[i].lastPlay = e;
          //socket.post({id:$scope.game.id,lastPlay:$scope.lastPlay});
          return;
        }

      }
    }
  }
  // $interval(function(){
  //   $scope.timeLeft += 1;
  //   //$log.log($scope.timeLeft);
  //   $scope.timeLeft = $scope.timeLeft %1000;
  // },16);
}])

.filter('icon', function(){
  var icons = {
    "SCISSORS": "ion-scissors",
    "ROCK": "ion-egg",
    "PAPER":"ion-document"
  };

  return function(value){
      return icons[value] || "";
  };
})
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
});
//
// .controller('DashCtrl', function($scope) {})
//
// .controller('ChatsCtrl', function($scope, Chats) {
//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   }
// })
//
// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })
//
// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });
