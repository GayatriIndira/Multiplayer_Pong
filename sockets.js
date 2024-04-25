let readyPlayerCount = 0;

function listen(io) {
//craete a Namespace
const pongNamespace = io.of('/pong');

// io.on() uses to register an event listener & socket is used to communicate with client or user
pongNamespace.on('connection', (socket) => {
let room;

    console.log('a user connected', socket.id);

    socket.on('ready', () => {
        room = 'room' + Math.floor(readyPlayerCount / 2);  //Math.floor remove the decimal points
        socket.join(room);

        console.log('Player ready', socket.id, room);

        readyPlayerCount++;

        if(readyPlayerCount % 2 === 0) {
            // broadcast to all clients that have connected to this room
            pongNamespace.in(room).emit('startGame', socket.id);  //.in(room) used to sending to all clients in room including sender
        }
    });

    socket.on('paddleMove', (paddleData) => {
    // socket.to(room) use for sending to all clients in room except sender
        socket.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
        socket.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected ${reason}`);
        socket.leave(room);  //leave room when client disconnects
    });
  })
} 

module.exports = {
    listen,
};