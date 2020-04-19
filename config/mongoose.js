const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development');

const db=mongoose.connection;

db.on('error',console.error.bind(console,'error connectning to mongodb'));

db.once('open',function(){
    console.log('Connected to database:: MongoDB');
})

module.exports=db;