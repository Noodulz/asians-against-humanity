const GameManager = require('../GameManager.js');

const enterLobby = (io, client) => {
  client.join('lobby');
  //send this only to the client who joined the room
  client.emit('allRooms', GameManager.rooms);
};

const createRoom = (io, client, roomname, username, deck) => {    
  client.leave('lobby');
  //----TODO-------------------------
  //NEED TO GRAB DECK FROM DB
  //db.Deck search by name and then getbthe id, 
  //then using that id get all black cards and white cards seperatey
  GameManager.createGame(roomname, username, deck);
  io.to('lobby').emit('newRoom', {name: roomname, createdBy: username});
  client.join(roomname);
  client.emit('canJoinRoom', roomname);
};

const joinRoom = (io, client, roomname, username) => {
  client.leave('lobby');
  GameManager.addPlayer(roomname, username);
  client.join(roomname);

  //emit just to the client that they have joined room
  client.emit('canJoinRoom', roomname);
  //emit to people curently in the room the new object to rerender their page
  //wait to do thius until user has joined in the room side
  // client.broadcast.to(roomname).emit('updateGameStatus', GameManager.games[roomname]);
};

module.exports = {
  enterLobby,
  createRoom,
  joinRoom
};


