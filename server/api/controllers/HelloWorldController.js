/**
 * HelloWorldController
 *
 * @description :: Server-side logic for managing helloworlds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * `HelloWorldController.index()`
   */
  index: function (req, res) {
    return res.json({
			msg: "Hello World!"
    });
  },
  subscribeToGame: function(req, res) {
    if (!req.isSocket) return res.badRequest();
    Game.joinGame(sails.sockets.id(req.socket)).then(function(game){
      sails.log.info(game);
      res.send(game);
      //.subscribe(request,records,[contexts])
      Game.subscribe(req.socket,game);

      //check if both players in
      if(game.player1SocketId && game.player2SocketId)
      {
        Game.changeStatus(game,"started").fail(function(){
          console.error("Error updating game status");
        }).done();

      }
    })
    .fail(function(err){
      sails.log.error(err,"ERROR");
      res.send(500);
    }).done();
  }
};
