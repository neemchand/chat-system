const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const process = require('process');
require('dotenv').config();

const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 5000, () => {
  console.log(`server is running on port`, process.env.PORT || 5000);
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// In-memory storage for messages (replaces MongoDB)
let messages = [
  {
    name: "System",
    message: "Welcome to the chat room!",
    timestamp: new Date()
  },
  {
    name: "Admin",
    message: "Feel free to start chatting!",
    timestamp: new Date()
  }
];
console.log('Using in-memory storage for messages');

// API endpoints
app.get('/messages', (req, res) => {
  console.log('GET /messages - Sending', messages.length, 'messages');
  res.json(messages);
});

app.post('/messages', (req, res) => {
  console.log('POST /messages - Received:', req.body);

  const message = {
    name: req.body.name,
    message: req.body.message,
    timestamp: new Date()
  };

  // Add message to in-memory storage
  messages.push(message);
  console.log('Message saved. Total messages:', messages.length);

  // Emit message to all connected clients
  console.log('Broadcasting message to all clients via Socket.IO');
  io.emit('message', message);

  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('User connected via Socket.IO. Socket ID:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected. Socket ID:', socket.id);
  });
});
