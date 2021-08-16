const http = require('http');
const socket = require('socket.io');
const express = require('express');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const db = require('../src/server/db/db');
const PORT = process.env.PORT || 8080;

// syncing the db
db.sync({ force: true})
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

	socket.on('join', ({ name, room }) => {
		console.log(name, room);
	})
	socket.on('disconnect', () => {
		console.log('user has left');
	});
});
// mounted on api per usual
app.use('/api', require('./server/api/index'));

server.listen(PORT, () => console.log(`server: listening on PORT ${PORT}`));
