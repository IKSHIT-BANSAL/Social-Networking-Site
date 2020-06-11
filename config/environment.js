const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname,'../production_logs');
//if file exist then use else create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

//create a rotating stream
//acess.log is file name created with
const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',  //rotate daily
    path:logDirectory
})

//this is development environement where all fields are setted up which are required to be hidden
const development={
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'Something',
    db:'codeial_development',
    smtp :{
        service:'gmail',
        host:'smtp.gmail.com',      //for port 587
        port:587,
        secure:false,
        auth:{              //from user mails are sent to other
            user:'ikshitbansal1998@gmail.com',
            pass:'ikshit1998'
        }
    },
    google_client_ID:"915546936075-eof96n3iqj1olpjsdmeqd23l9scc3sac.apps.googleusercontent.com",
    google_clientSecret:"ujBbRXIw_qrGoRj2mTtOpolc",
    google_callbackURL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codeial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}

//this is production environment
const production={
    name:'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,  //generated from randomKeygen.com
    db:'codeial_production',
    smtp :{
        service:'gmail',
        host:'smtp.gmail.com',      //for port 587
        port:587,
        secure:false,
        auth:{              //from user mails are sent to other
            user:process.env.CODEIAL_GMAIL_USERNAME,
            pass:process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_ID:process.env.GOOGLE_CLIENT_ID,
    google_clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    google_callbackURL:process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,     //generated from randomKeygen.com
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }                     
}

module.exports=eval(process.env.CODEIAL_ENVIRONMENT)==undefined?development:eval(process.env.CODEIAL_ENVIRONMENT);

// module.exports=development;