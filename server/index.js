const http = require('http');
const socket = require('socket.io');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const db = require('../server/db/index').db; // need to actually run the index, that's where the associations lie.
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');

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
app.use(morgan('dev'));

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
		socket.emit('initializeChatbot', { user: 'ChatBot', room, text: `${name}, welcome to the room ${room}` });

		socket.join(room);

		socket.to(room).emit('initializeChatbot', { user: 'ChatBot', room, text: `${name}, has joined!` });
	});

	// waiting for an emitted event from the front-end
	socket.on('sendMessage', ({ user, msg }) => {
		console.log(user, msg);
		// We can emit a message to the room relative to user object from front-end call
		io.in(user.room).emit('message', { user, msg });
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

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('An error has occured!');
});

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
server.listen(PORT, () => console.log(`server: listening on PORT ${PORT}`));
