const express = require('express');
const app = express();
const socket = require('socket.io');

const task = [];


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.emit('updateData', tasks);

  socket.on('addTask', ({ task, id }) => {
    tasks.push({ task, id });
    socket.broadcast.emit('addTask', { user, id });
  });

  socket.on('removeTask', (id) => {
    const index = tasks.findIndex((element) => element.id == id);
    if (index != -1) {
      tasks.splice(index, 1);
    }
    socket.broadcast.emit('removeTask', id);
  });

});
