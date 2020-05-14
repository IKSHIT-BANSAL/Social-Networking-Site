const express=require('express');

//Requiring a cookie
const cookieParser=require('cookie-parser');

const app=express();
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
const customMware=require('./config/middleware')

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());    //Used Cokkie in the middleware
app.use(express.static('./assets'));

//use layouts
app.use(expressLayouts);

//make uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

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
    secret:'Something',
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