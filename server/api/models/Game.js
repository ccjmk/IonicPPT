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
        ROUND_STARTED: 1,
        FINISHED: 2
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
    joinGame: function(socketId, playerName) {
        var findGamePromise = Game.findOne()
            .where({
                status: Game.STATUS.AWAITING_PLAYER
            })
            .populate("players");

        var createGameIfNotPromise = findGamePromise.then(function(game) {
            if (game) {
                return game;
            }

            return Game.create({
                round: 0,
                status: Game.STATUS.AWAITING_PLAYER
            });
        });

        var createPlayerPromise = createGameIfNotPromise.then(function(game) {
            var playerPromise = Player.create({
                socketId: socketId,
                name: playerName,
                lastPlay: null,
                wins: 0,
                game: g.id
            });
            return Q.when(game, playerPromise);
        });

        var gameWithPlayersPromise = createPlayerPromise(function(game, player) {

            if (!game.players) {
                game.players = [];
            }

            game.players.push(player);
            Game.publishUpdate(game.id, game);

            return game;
        });

        gameWithPlayersPromise.fail(function(e) {
            sails.log.error(e);
        });

        return gameWithPlayersPromise;
    }

    /*Cuando el 2do jugador entra en el juego, se manda un evento de comienzo
    a ambos; cuando pasa X tiempo se hace una query en la db para ver como quedo
    el juego, se actualizan los marcadores, se vacian las ultimas jugadas
    y se informa a los jugadores.
    */

};
