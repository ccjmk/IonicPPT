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

    status:  { type : 'integer' },
    round: { type: 'integer' }


  /*  players: {
     collection: 'play',
     via: 'match'
   }*/
 },
 changeStatus: function(game, status){
   game.status = status;
   return Game.update(game.id,game).then(function(updated){
     Game.publishUpdate(updated[0].id,updated[0]);
     return updated[0];
   });
 },
 joinGame: function(socketId){
  return Game.findOne({
    where: {status: Game.STATUS.AWAITING_PLAYER}
  }).then(function(g){
    if(g)
    {
      //join to existing game
      sails.log.info(socketId,"existingGame socketId");
      g.player2SocketId = socketId;
      return Game.update(g.id /*search critera*/, g).then(function(updated){
        Game.publishUpdate(updated[0].id,updated[0]);
        return updated[0];
      });
    }
    else
    {
      //create new game
      sails.log.info(socketId,"newGame socketId");


      return Game.create({
        round: 0,
        status: Game.STATUS.AWAITING_PLAYER
      }).then(function(game){
        return [game, Player.create({
          socketId: socketId,
          lastPlay: null,
          wins: 0,
          game: game.id
        })];

     }).spread(function(game, player){
          game.players = [player];
          return game;

      });
    }
  });




  //  Game.findOne({
  //    where: {player1SocketId: null}
  //  }).exec(function(err,g){
  //    if(err){
  //      cb(err, null);
  //    }
  //    else if(g)
  //    {
  //      //join to existing game
  //      g.player2SocketId = sockedId;
  //      Game.update(g.id /*search critera*/, g).exec(function(err, updatedRecords){
  //        cb(err, updatedRecords[0]);
  //      });
   //
  //    }
  //    else
  //    {
  //      //create new game
  //      Game.create({player1SocketId: socketId}).exec(function(err, newGame){
  //        cb(err, newGame);
  //      });
  //    }
  //    //console.log(g, err)
  //  });
 }

 /*Cuando el 2do jugador entra en el juego, se manda un evento de comienzo
 a ambos; cuando pasa X tiempo se hace una query en la db para ver como quedo
 el juego, se actualizan los marcadores, se vacian las ultimas jugadas
 y se informa a los jugadores.
 */

};
