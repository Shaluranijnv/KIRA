const chatForm = document.getElementById('chat-form');
const roomName = document.querySelectorAll('h2.room-name');
const userList = document.querySelectorAll('.users')
//get username and room from url
const {username,room}= Qs.parse(location.search,{
  ignoreQueryPrefix: true
})





const socket = io();

// join chat room
socket.emit('joinroom',{username,room});

//get room and users
socket.on('roomusers',({room,users})=>{
  
  outputRoomName(room);
  outputUsers(users);
}
 );
var messages=document.getElementById('chat-messages');
//message from server
socket.on('message',(message)=>{
 
  outputMessage(message);

});

//message submit


chatForm.addEventListener("submit", function(e){
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;
   
    //emit message to server
    socket.emit('chatMessage',msg);
   
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
   
    
  });

  //output message to DOM
  function outputMessage(message){
   
            const div = document.createElement('div');
            div.classList.add('message');
            div.innerHTML=`
            <p class="meta">${message.username} <span>   ${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>
         
            `;
            messages.appendChild(div);
            messages.scrollTop=messages.scrollHeight;
           
  }


  //add room Name to DOM
  function outputRoomName(room){
       roomName[0].innerText=room;
       roomName[1].innerText=room;

  }

  // add users to DOM function
  function outputUsers(users){
    
    userList[0].innerHTML=`${users.map(user=>`<li><span class="bulb"><span>   ${user.username}</li>`).join('')}`;
    userList[1].innerHTML=`${users.map(user=>`<li><span class="bulb"><span>   ${user.username}</li>`).join('')}`;
    
   }


   //typing event
  /* var typing=false;
   var timeout=undefined;
   function typingTimeout(){
     typing=false;
     
   }
   $(document).ready(function(){
    $('#msg').keypress((e)=>{
      socket.emit('typing',typing=true);
     if(e.which!=13){
         
         
        console.log("user typed")
        socket.emit('typing',typing=true)
        clearTimeout(timeout)
        timeout=setTimeout(typingTimeout, 3000)
     }else{
        clearTimeout(timeout)
        typingTimeout()
        socket.emit('typing',typing)
        //sendMessage() function will be called once the user hits enter
        
      }
    })

    //code explained later
    socket.on('display', (typing)=>{
      if(typing==true){
        console.log('display event on')
        $('.typing').text(`user is typing...`)
      }
      else
        $('.typing').text("")
    })
})*/