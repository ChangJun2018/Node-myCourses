if(process.env.NODE_ENV=="production"){
    module.exports= {mongoURL:"mongodb://changjun:qinian521@ds235850.mlab.com:35850/node-app-prod"};
}else{
    module.exports= {mongoURL:"mongodb://localhost/node-app"};
}