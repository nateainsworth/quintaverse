var bodyParser = require('body-parser')
const cors = require('cors')
const serveStatic = require('serve-static')
//const fs = require("fs");
//const util = require('util');
const path = require('path')
const cookieParser = require("cookie-parser");
const express = require('express');

//TODO load in database using database object


// Setting up App
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cors())
app.use(cookieParser());
app.use(express.static(__dirname + '/public/'))
app.get(/.*/, (req,res) => res.sendFile(__dirname + '/public/index.html'))

const PORT = process.env.PORT || 8080;


//Setting up socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('A user has made a connection');
    socket.on('disconnect', ()=>{
        console.log("A user disconnected");
	})
});


server.listen(PORT, () => console.log('The server started on port ' + PORT + '')); 