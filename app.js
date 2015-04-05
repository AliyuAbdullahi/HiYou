var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    nicknames =[];
server.listen(3000);
app.get('/',function(req,res){
  res.sendfile(__dirname+'/index.html');
});


io.sockets.on('connection',function(socket){
  socket.on('new user',function(data, callback){
    if(nicknames.indexOf(data) != -1){
      callback(false);
    }
    else{
      callback(true);
      socket.nickname = data;
      nicknames.push(socket.nickname);
      updateNIck();
    }
  });
  function updateNIck(){
      io.sockets.emit('usernames',nicknames);

  }
  socket.on('send message',function(data){
    io.sockets.emit('new message',{msg:data,nick:socket.nickname});
   
  });
  socket.on('disconnect',function(data){
    if(!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname),1);
    updateNIck();

  });
});

// var express = require('express'),
//     app = express(),
//     server = require('http').createServer(app),
//     io = require('socket.io').listen(server),
//     messages = [],
//     sockets = [];

// app.use( express.static(__dirname + '/public'));

// server.listen(4000);

// io.sockets.on('connection', function (socket) {

//     sockets.push(socket);

//     socket.emit('messages-available', messages);

//     socket.on('add-message', function (data) {
//         messages.push(data);
//         sockets.forEach(function (socket) {
//             socket.emit('message-added', data);
//         });
//     });
// });