const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const process = require('process');
require('dotenv').config();

const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port', process.env.PORT || 5000);
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = `mongodb://${process.env.DB_HOST || 'localhost'}:${
  process.env.DB_PORT || 27017
}/${process.env.DB_NAME || 'chatdb'}`;

console.log('Connecting to MongoDB at:', dbUrl);

mongoose.connect(dbUrl)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// API endpoints
app.get('/messages', async (req, res) => {
  try {
    console.log('GET /messages - Fetching messages from database');
    const messages = await Message.find().sort({ timestamp: 1 });
    console.log('GET /messages - Sending', messages.length, 'messages');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/messages', async (req, res) => {
  try {
    console.log('POST /messages - Received:', req.body);
    
    const message = new Message({
      name: req.body.name,
      message: req.body.message
    });
    
    const savedMessage = await message.save();
    console.log('Message saved to database. ID:', savedMessage._id);
    
    // Emit message to all connected clients
    console.log('Broadcasting message to all clients via Socket.IO');
    io.emit('message', savedMessage);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected via Socket.IO. Socket ID:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected. Socket ID:', socket.id);
  });
});
