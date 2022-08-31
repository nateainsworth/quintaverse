var bodyParser = require('body-parser')
const cors = require('cors')
const serveStatic = require('serve-static')
//const fs = require("fs");
//const util = require('util');
const path = require('path')
const cookieParser = require("cookie-parser");
const express = require('express');

const WebSocket = require('ws');

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

const wss = new WebSocket.Server({ server });
//const wss = new WebSocket(server);
const clients = new Map();

wss.on('connection', (ws) => {
   // create an id to track the client
   const id =  Math.random().toString(36).substr(2, 9);
   clients.set(ws, id);
   console.log(`new connection assigned id: ${id}`);

   // send a message to all connected clients upon receiving a message from one of the connected clients
   ws.on('message', (data) => {
       console.log(`received: ${data}`);
       serverBroadcast(`Client ${clients.get(ws)} ${data}`);
   });

   // stop tracking the client upon that client closing the connection
   ws.on('close', () => {
       console.log(`connection (id = ${clients.get(ws)}) closed`);
       clients.delete(ws);
   });

   // send the id back to the newly connected client
   ws.send(`You have been assigned id ${id}`);
});

// send a message to all the connected clients about how many of them there are every 15 seconds

/*setInterval(() => {
    console.log(`Number of connected clients: ${clients.size}`);
    serverBroadcast(`Number of connected clients: ${clients.size}`);
}, 15000);*/

// function for sending a message to every connected client
function serverBroadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log('The server is running and waiting for connections');

io.on('connection', (socket) => {
    console.log('A user has made a connection');
    socket.on('disconnect', ()=>{
        console.log("A user disconnected");
	})
});


server.listen(PORT, () => console.log('The server started on port ' + PORT + '')); 