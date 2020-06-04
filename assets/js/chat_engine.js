//file communicating with client side with us

class ChatEngine{
    constructor(ChatBoxId,userEmail){
        this.ChatBoxId=$(`#${ChatBoxId}`);      //fetching id of chatBox by jquery
        this.userEmail=userEmail;

        //io ia a global variable from cdn documentation
        this.socket=io.connect('http://localhost:5000');        //inbuilt socket library used from home.ejs

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    //provide to and from connection to user
    connectionHandler(){

        //from here we are going to chat_sockets.js file

        let self=this;
        //on is used to receive event
        //connect is an event
        this.socket.on('connect',function(){
            console.log('Connection established using sockets....!');

            //join_room is name of event we can write any name of this to sent request to join room
            self.socket.emit('join_room',{
                user_email:self.userEmail,  //passing respective data with that of user
                chatroom:'codeial'
            })

            //request received back that user is here
            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            })
        });

        $('#send-message').click(function(){
            let msg=$('#chat-message-input').val();
            if(msg!=''){
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatroom:'codeial'
                });
            }
        })        
        
        self.socket.on('receive_message',function(data){
            // setInterval(update,1000);
            console.log('message received',data.message);

            let newMessage=$('<li>');       //list item is created
            let messageType='other-messages';
            
            if(data.user_email==self.userEmail){
                messageType='self-messages';
            }
            newMessage.append($('<span>',{
                'html':data.message
            }));
            newMessage.append($('<sub>',{
                'html':data.user_email
            }));
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            
        })
        
    }
}