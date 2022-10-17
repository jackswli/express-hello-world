const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const { Server } = require("socket.io");
const io = new Server(server);

user_count = 0;

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });
app.get('/heartbeat', (req, res) => {
    io.emit('chat message', 'Welcome, total ' + user_count + " user(s).");
    res.send("OK");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    user_count = user_count + 1;
    socket.broadcast.emit('hi');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        user_count = user_count - 1;
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', + msg);
    });
});

server.listen(port, () => {console.log(`server started listening on ${port}`);});