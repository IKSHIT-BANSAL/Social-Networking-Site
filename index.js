const express=require('express');

//Requiring a cookie
const cookieParser=require('cookie-parser');

const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

app.use(express.urlencoded());
app.use(cookieParser());    //Used Cokkie in the middleware
app.use(express.static('./assets'));

//use layouts
app.use(expressLayouts);

//To extract and style from sub pages into the layour
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//use express router
app.use('/',require('./routes'));

//setup our view engine Ejs
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})