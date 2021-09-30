const Sequelize = require('sequelize');
const db = require('../db');

const Room = db.define('room', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
});

Room.afterCreate(async (room) => {
	// room.createUser is a magic method we can utilize.
	await room.createUser({ name: 'ChatBot', room: room.name });
});

Room.create({ name: 'test' })
	.then(() => console.log('yay'))
	.catch((err) => console.log(err));

module.exports = Room;
