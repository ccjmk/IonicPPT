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
        ROUND_STARTED: 2,
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
                lastPlay: null,
                wins: 0,
                game: game.id
            });
        });

        var gameWithPlayersPromise = createPlayerPromise.then(function(player) {
            return Game.findOne().where({id:player.game}).populate("players");
        });


        var publishAndLogErrors = gameWithPlayersPromise.then(function(game){
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
