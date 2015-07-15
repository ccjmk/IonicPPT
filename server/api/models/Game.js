/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

    STATUS: {
        //Available States:

        AWAITING_PLAYER: 0,
        READY_TO_PLAY: 1,
        AWAITING_RESULT: 2,
        FINISHED: 3
    },

    attributes: {

        players: {
            collection: 'player',
            via: 'game'
        },

        status: {
            type: 'integer'
        },
        round: {
            type: 'integer'
        }
    },

    changeStatus: function(game, status) {
        game.status = status;
        return Game.update(game.id, game).then(function(updated) {
            Game.publishUpdate(updated[0].id, updated[0]);
            return updated[0];
        });
    },
    findGameById: function(id)
    {
      sails.log.info("Finding By Id Game", id);
      return Game.findOneById(id)
      .populate("players");
    },
    isWinner: function(element, otherPlayerElement)
    {
      if(element == otherPlayerElement)
      {
        return 0;
      }
      if((element == "ROCK" && otherPlayerElement == "SCISSORS")
        || (element == "SCISSORS" && otherPlayerElement == "PAPER")
        || (element == "PAPER" && otherPlayerElement == "ROCK"))
      {
        return 1;
      }
      return -1;
    },
    play: function(gameId,playerId,play)
    {
      var updatePlayerPromise = Player.update(playerId,{currentPlay:play});

      var loadGamePromise = updatePlayerPromise.then(function(){
        return Game.findGameById(gameId);
      });

      var verifyGameStatePromise = loadGamePromise.then(function(game){
        if(game.status === Game.STATUS.READY_TO_PLAY)
        {
          game.status = Game.STATUS.AWAITING_RESULT;
        }
        else
        {
          game.status = Game.STATUS.READY_TO_PLAY;
          //Calculate Results
          _.forEach(game.players, function(player,i){
            player.lastResult = Game.isWinner(game.players[i].currentPlay,
            game.players[(i+1)%2].currentPlay);
            player.wins += player.lastResult == 1 ? 1 : 0;
          });

          //Clean Play
          var updates = [];
          _.forEach(game.players, function(player){
            player.lastPlay = player.currentPlay;
            player.currentPlay = null;
            updates.push(Player.update(player.id,player));
          });
        }
        //updates
        Game.publishUpdate(game.id, game);
        return game;
      });

      return verifyGameStatePromise;
    },
    joinGame: function(playerName,socketId) {
        var findGamePromise = Game.findOne()
            .where({
                status: Game.STATUS.AWAITING_PLAYER
            })
            .populate("players");

        var createGameIfNotPromise = findGamePromise.then(function(game) {
            if (game) {
                sails.log.info("Existing game");
                game.status = Game.STATUS.READY_TO_PLAY;
                return Game.update(game.id,game).then(function(games){
                  return games[0];
                });
            }
            sails.log.info("Creating new game");
            return Game.create({
                round: 0,
                status: Game.STATUS.AWAITING_PLAYER,
                players: []
            });
        });

        var createPlayerPromise = createGameIfNotPromise.then(function(game) {
            sails.log.info("Creating player");
            return Player.create({
                socketId: socketId,
                name: playerName,
                currentPlay: null,
                lastPlay: null,
                wins: 0,
                game: game.id
            });
        });

        var gameWithPlayersPromise = createPlayerPromise.then(function(player) {
            return Game.findGameById(player.game);
        });


        var publishAndLogErrors = gameWithPlayersPromise.then(function(game){
          sails.log.info("publishingUpdate", game);
          Game.publishUpdate(game.id, game);
          return game;
        }).fail(function(e) {
          sails.log.error(e);
          return e;
        });

        return publishAndLogErrors;
    }

    /*Cuando el 2do jugador entra en el juego, se manda un evento de comienzo
    a ambos; cuando pasa X tiempo se hace una query en la db para ver como quedo
    el juego, se actualizan los marcadores, se vacian las ultimas jugadas
    y se informa a los jugadores.
    */

};
