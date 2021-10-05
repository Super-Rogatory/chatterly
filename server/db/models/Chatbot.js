const Sequelize = require('sequelize');
const db = require('../db');

const Chatbot = db.define('chatbot', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			equals: 'chatbot',
		},
	},
	room: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
});

module.exports = Chatbot;
