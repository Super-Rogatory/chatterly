const Sequelize = require('sequelize');
const Message = require('./Messages');
const Op = Sequelize.Op;
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

// if the user is a guest user, their messages will be destroyed in an hour, also their record in the database will get destroyed.
User.afterCreate((user) => {
	if (user.isGuest) {
		setTimeout(async () => {
			await Message.destroy({
				where: {
					userId: {
						[Op.eq]: user.id,
					},
				},
			});
			await user.destroy();
		}, 3000);
	}
});
module.exports = User;
