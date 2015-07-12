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
  play: function(req,res)
  {
      Game.play({
        gameId: req.param("gameId"),
        playerId: req.param("playerId"),
        lastPlay: req.param("lasPlay")
      }).then(function(game){      
        res.json({});
      }).fail(function(err){
        sails.log.error(err,"ERROR");
        res.send(500,err);
      }).done();

  },
  subscribeToGame: function(req, res) {
    if (!req.isSocket) return res.badRequest();
    Game.joinGame(req.param("name"), sails.sockets.id(req.socket)).then(function(game){
      sails.log.info(game);
      res.send(game);
      Game.subscribe(req.socket,game);
    })
    .fail(function(err){
      sails.log.error(err,"ERROR");
      res.send(500,err);
    }).done();
  }
};
