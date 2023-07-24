// add require a express
const express = require('express');
// local host path
const port = 8000;
// add express in app
const app = express();
// sent a data in json form
app.use(express.json())
// require a router in userrouter path 
const userRouter = require('./routers/userRouter');
// '/', are automatic accesssing a router name 
app.use('/', userRouter);


 // require a mongoose db
const db = require('./config/mongoose');
// listen a port and server is running on port
app.listen(port, function(err){
    if(err){
        console.log('Sever is running on port', 8000);
    }
    console.log('Sever is running on port', 8000);
})