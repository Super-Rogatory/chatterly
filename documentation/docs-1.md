# Chatterly

- ## One of the first steps I took was to setup up the project tree, I wanted to import only index.css in index.js and have all other styles follow suite. I setup server, client, and other necessary directories.
- ## Recall that HTTP Requests imply that for every request you get a response. AJAX allowed us to make more than one request, such that, after a request has been sent wew can asynchronously send another given some event. Websockets is a sort of upgrade over HTTP. HTTP's stateless nature is upgraded such that sockets can provide bi-directional communication from client to server.

```
const http = require('http');
const socket = require('socket.io');
const express = require('express');
const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

const io = socket(server);

server.listen(PORT, () => console.log(''))
```

- ## NOTE: io is the server instance.
```
io.on('connection', (socket) => {
    console.log('we have a new connection');

    socket.on('disconnect', () => {
        console.log('user has left');
    })
})
```
- ## 'connection' and 'disconnect' are built in keywords for the socket.io module
- ## io.on is an event that is fired upon a new connection. We can register when clients join and when they leave with this information.
- ## the socket parameter is a server side socket.
- ## Most of our code WILL BE INSIDE the io.on callback, as that function is what has access to the socket.

- ## Allow Origins Error Requires. On server-side.
```
const io = socket(server, {
	cors: {
		origin: '*',
	},
});
```

- ## We can emit events from the client side socket, given a name, it will match with the server side socket on specified name.

- ##**EXAMPLE. Client side**
```
clientSocket.emit('join', { name, room })
```

- ##**EXAMPLE. Server side**
```
io.on('connection', (socket) => {
	console.log('we have a new connection');

	socket.on('join', ({ name, room }) => {
		console.log(name, room);
	})
	socket.on('disconnect', () => {
		console.log('user has left');
	});
});
```