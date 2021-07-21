const path= require('path');
const http =require('http');
const express =require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages')
const {userJoin ,getCurrentUser, userLeave,getRoomUsers} = require('./utils/users');

const app=express();
const server = http.createServer(app);
const io=socketio(server);


//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName='Admin ~ Shalu Rani';
//run when client connects

io.on('connection',socket=>{
    socket.on('joinroom',({username,room})=>{
      const user = userJoin(socket.id,username,room);

      socket.join(user.room)
      socket.emit('message',formatMessage(botName,'welcome to KIRA!')); // it wil be shown to the single user who is connecting

    //broadcast when a user coonects
 
    socket.broadcast
    .to(user.room)
    .emit(
      'message',
      formatMessage(botName,`${user.username} has joined the room`)
      ); // and this message will be broadcsted to everyone except user who is connecting;
    
    
      io.to(user.room).emit('roomusers',{
             room:user.room,
             users: getRoomUsers(user.room)
      });

  })

/*socket.on('typing', (typing)=>{
    if(typing==true)
       io.emit('display', typing)
    else
       io.emit('display', typing)
  });
*/
   //Listen for chatMessage
   socket.on('chatMessage', (msg) => {
     const user = getCurrentUser(socket.id);

       io.to(user.room).emit('message',formatMessage(user.username,msg))
 
  });

    //runs when a user disconnects

    // io.emit( ) is used to notify all the clients
    socket.on('disconnect',()=>{
      const user=userLeave(socket.id);
      if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

        io.to(user.room).emit('roomusers',{
          room:user.room,
          users: getRoomUsers(user.room)
          });



      };

      
    });
   

 });

const PORT=process.env.PORT||3000;
server.listen(PORT,()=> console.log(`server running on port ${PORT}`));

