const express=require('express');
const env=require('./config/environment');
const logger=require('morgan');
const cors=require('cors');

//Requiring a cookie
const cookieParser=require('cookie-parser');

const app=express();
//(app) to access viewHelpers in views 
require('./config/view-helpers')(app);
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

//Used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore=require('connect-mongo')(session);   //as we r required to store session cookie there so arg r required
const sassMiddleware=require('node-sass-middleware');

const flash=require('connect-flash');
const customMware=require('./config/middleware');

//setup the chat server to be used with socket.io
const chatServer=require('http').Server(app);
const chatSocket=require('./config/chat_sockets').chatSockets(chatServer);  //chatSockets is a func in config file
chatServer.listen(5000);
console.log('Chat Server is listening on port 5000');
const path=require('path');
app.use(cors());

if(env.name=='development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
    }));
}


app.use(express.urlencoded({extended : false}));
app.use(cookieParser());    //Used Cokkie in the middleware
app.use(express.static(env.asset_path));

//use layouts
app.use(expressLayouts);

//make uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode,env.morgan.options))
// app.use(logger);

//To extract and style from sub pages into the layour
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//setup our view engine Ejs
app.set('view engine','ejs');
app.set('views','./views');

//Mongo store is use to store session cookie in db
app.use(session({
    name:'Codeial',
    //ToDO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
    {
        mongooseConnection:db,
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'connect mongo db setup okk')
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})