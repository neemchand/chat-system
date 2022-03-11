const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const io = require('socket.io');

const server = app.listen(8080, () => {
  console.log(`server is running on`, server.address().port);
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = 'mongodb://localhost:27017/chat-system';

mongoose.connect(dbUrl, (err) => {
  if (err) {
    return err;
  }
  console.log('mongo db connected successfully');
});

//Model
const Message = mongoose.model('Message', { name: String, message: String });

// api
app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) return res;
    res.sendStatus(200);
  });
});
