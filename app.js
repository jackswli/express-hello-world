const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });
app.get('/heartbeat', (req, res) => {
    io.emit('chat message', 'Welcome.');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    socket.on('disconnect', () => { console.log('user disconnected'); });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

server.listen(port, () => {console.log(`server started listening on ${port}`);});