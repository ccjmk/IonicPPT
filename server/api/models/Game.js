/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    player1SocketId: { type : 'string'},
    p1LastPlay:  { type : 'string'},
    p1Wins: { type : 'integer'},

    player2SocketId: { type : 'string', required: false},
    p2LastPlay: { type : 'string'},
    p2Wins: { type : 'integer'},

    status:  { type : 'string'}


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
    where: {player2SocketId: null}
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
      return Game.create({player1SocketId: socketId, player2SocketId: null});
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
