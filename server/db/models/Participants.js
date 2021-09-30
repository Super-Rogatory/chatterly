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
module.exports = Participants;
