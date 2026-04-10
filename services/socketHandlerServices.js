// socketHandler.js
export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      socket.emit('server reply', 'Server got your message');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}