const http = require('http');
const socket = require('socket.io');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const db = require('../server/db/index').db; // need to actually run the index, that's where the associations lie.
const morgan = require('morgan');

const PORT = process.env.PORT || 5000;

// syncing the db
db.sync({ force: true })
	.then(() => console.log('Database is synced'))
	.catch((err) => console.log('Error syncing the db', err));

// cross origin middleware
app.use(cors());

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serves static files from the React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// logging middleware
app.use(morgan(`${process.env.NODE_ENV === 'production' ? 'common' : 'dev'}`));

// allows access control
app.use((req, res, next) => {
	res.set('Content-Type', 'application/json');
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

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
		socket.emit('initializeChatbot', { text: `${name}, welcome to the room ${room}` });

		socket.join(room);
		// emitting to all clients in the room except the user.
		socket.to(room).emit('initializeChatbot', { text: `${name}, has joined!` });
	});

	// waiting for an emitted event from the front-end
	socket.on('addedMessage', (user) => {
		// We can emit a message to the room relative to user object from front-end call
		io.in(user.room).emit('message', user);
	});

	// update inactive users takes care of the active/inactive status (when the exit button is clicked)
	socket.on('refreshOnlineUsers', (user) => {
		io.in(user.room).emit('refreshUserList', user);
	});
	socket.on('sendDisconnectMessage', (user) => {
		io.in(user.room).emit('disconnectMessage', { text: `${user.name} has left.` });
	});

	socket.on('disconnect', () => {
		console.log('user has left');
	});
});

// mounted on api per usual
app.use('/api', require('../server/api/index'));

// handling 404
app.use((req, res, next) => {
	res.status(404).send('SORRY. Could not find the information you are looking for!');
});

// error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('An error has occured!');
});

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

server.listen(PORT, () => console.log(`server: listening on PORT ${PORT}`));
