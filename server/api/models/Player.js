/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    socketId : { type: 'string' },

    name: { type: 'string' },

    currentPlay : { type: 'string'},
    
    lastPlay : { type: 'string' },

    wins : { type: 'integer' },

    game: {
      model: 'game'
    }
  }
};
