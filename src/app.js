const http = require('http');
const socket = require('socket.io');
const express = require('express');
const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// socket.io server instance
const io = socket(server);

io.on('connection', (socket) => {
    console.log('we have a new connection');

    socket.on('disconnect', () => {
        console.log('user has left');
    })
})
// mounted on api per usual
app.use('/api', require('./server/api/index'));

server.listen(PORT, () => console.log(`server: listening on PORT ${PORT}`));