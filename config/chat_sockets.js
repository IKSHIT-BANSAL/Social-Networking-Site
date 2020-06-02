//this file is a observer recieving msg from subscribers
module.exports.chatSockets=function(socketServer){
    //io will be handling the connections
    let io=require('socket.io')(socketServer);

    //connection is event
    io.sockets.on('connection',function(socket){
        console.log('New connection received',socket.id);   //socket is an object with many properties

        //when disconnected the server :: disconnect is an action
        socket.on('disconnect',function(){
            console.log('Socket disconnected:');
        });

        //event received which is emit from chat_engine.js 
        socket.on('join_room',function(data){
            console.log('Joining request received',data);
            //if room exist then join to it else create chatroom and join room
            socket.join(data.chatroom);
            //to show notification to other user that he/she has joined
            io.in(data.chatroom).emit('user_joined',data);  //user_joined is event we made
        })

        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        })

    });
}