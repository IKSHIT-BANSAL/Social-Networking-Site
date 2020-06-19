const env=require('./environment');
const fs=require('fs');
const path=require('path');

//(app) is arguments passed
module.exports=(app)=>{
    //assetPath is an object here in locals
    app.locals.assetPath=function(filePath){
        if(env.name=='development'){
            return '/' + filePath;
        }
        //filePath is use to access key in rev-manifest
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath];
    }
}