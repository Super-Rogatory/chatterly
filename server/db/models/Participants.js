const Sequelize = require('sequelize');
const db = require('../db');
const Participants = db.define('participants', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
});

// The idea: When we enter a valid username and room name we want to create a Participants instance tied to a room name.
// Once the participants are created, we also want to create the chatbot!

module.exports = Participants;
