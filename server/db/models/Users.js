const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		unique: true,
	},
	room: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	isGuest: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	},
});

User.afterCreate((user) => {
	if (user.isGuest) {
		setTimeout(async () => {
			console.log(user);
		}, 3000);
	}
});
module.exports = User;
