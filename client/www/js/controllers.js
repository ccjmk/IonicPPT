angular.module('starter.controllers', [])

.controller("HomeCtrl",["$scope", "$timeout", "$location", "HelloWorld","$log",
  function($scope, $timeout, $location, HelloWorld,$log){
  $scope.login = function(){
    $location.path("#game");
  }
}])

.controller('GameCtrl', ["$scope", "$timeout", "$interval", "socket", "$log", "_",
function($scope, $timeout, $interval, socket, $log, _){
  //hago request para que me subscriban a un juego
  var STATUS = {
      //Available States:
      AWAITING_PLAYER: 0,
      READY_TO_PLAY: 1,
      AWAITING_RESULT: 2,
      FINISHED: 3
  };
  $scope.game = {};

  $scope.buttonsDisabled = function(){
    switch($scope.game && $scope.game.status){
      case STATUS.READY_TO_PLAY:
        return false;
        break;
      case STATUS.AWAITING_RESULT:
        var player = _.findWhere($scope.game.players, {name: $scope.username});
        return player.currentPlay !== null;
        break;
      default:
        return true;
    }
  }
  $scope.username = "User" + Math.ceil(Math.random()*100);

  socket.post("/game/subscribeToGame",
    {name: $scope.username },
    function(data){
    $scope.$apply(function(){
        $log.log(data);
        $scope.game = data;
    });
  });

  // $scope.timeLeft = 0;


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
      var player = _.findWhere($scope.game.players, {name: $scope.username});
      player.currentPlay = e;
      $scope.game.status = STATUS.AWAITING_PLAYER;
      socket.post("/game/play", {
          gameId: $scope.game.id,
          playerId: player.id,
          currentPlay: e
        }, function(res){
        //  res.data;
      });
      return;
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

.filter('stringify', function(){
  return function(value){
      return JSON.stringify(value, null, '\t');
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
