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

Room.afterCreate = async (room) => {
	// look up magic methods after associations are made.
};
module.exports = Room;
