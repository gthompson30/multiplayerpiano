/*var express = require('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New connection: ' + socket.id);

  socket.on('mouse', mouseMsg);

  function mouseMsg(data) {
    socket.broadcast.emit('mouse', data)
    console.log(data);
  }
}
*/

var express = require('express');
var app = express();
var server = app.listen(3000);
var positions = {};
var pos = [];
var users = [];

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io')

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New connection: ' + socket.id);
  users.push(socket.id);

  socket.on('mouse', mouseMsg);

  function mouseMsg(data) {
    for (var i = 0; i < users.length; i++)
    positions[socket.id] = data;
    socket.broadcast.emit('mouse', [positions, users]);
  }

  socket.on('note', broadcastNote);

  function broadcastNote(data) {
    socket.broadcast.emit('note', data);
  }

  socket.on('disconnect', stoop);

  function stoop() {
    console.log('f in the chat for ' + socket.id);
    users.splice(users.indexOf(socket.id), 1);
    delete positions[socket.id];
  }
}
