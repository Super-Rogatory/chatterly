const http = require('http');
const socket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const db = require('../src/server/db/index').db; // need to actually run the index, that's where the associations lie.
const PORT = process.env.PORT || 8080;

// syncing the db
db.sync({ force: true })
	.then(() => console.log('Database is synced'))
	.catch(() => console.log('Error syncing the db'));

// cross origin middleware
app.use(cors());

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// socket.io server instance
const io = socket(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (socket) => {
	console.log('we have a new connection');

	socket.on('join', ({ id, name, room }) => {
		// a valid id, name, and room indicates successful creation of a user in the front-end.
		console.log(id, name, room);

		// emitting an event from the back-end to the front-end
		socket.emit('initializeChatbot', { user: 'ChatBot', room, text: `${name}, welcome to the room ${room}` });

		socket.broadcast.to(room).emit('initializeChatbot', { user: 'ChatBot', text: `${name}, has joined!` });

		socket.join(room);
	});

	// waiting for an emitted event from the front-end
	socket.on('sendMessage', ({ user }) => {
		// We can emit a message to the room relative to user object from front-end call
		io.to(user.room).emit('message');
	});

	socket.on('sendDisconnectMessage', (user) => {
		io.to(user.room).emit('disconnectMessage', { text: `${user.name} has left.` });
	});

	socket.on('disconnect', () => {
		console.log('user has left');
	});
});
// mounted on api per usual
app.use('/api', require('./server/api/index'));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('An error has occured!');
});

server.listen(PORT, () => console.log(`server: listening on PORT ${PORT}`));
