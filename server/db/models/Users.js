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
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
	},
	salt: {
		type: Sequelize.STRING,
	},
	hash: {
		type: Sequelize.STRING,
	},
});

User.getActiveUserCount = async function () {
	const players = await this.findAll({ where: { active: true } });
	return players.length;
};
// if the user is a guest user, their messages will be destroyed in 30 min, also their record in the database will get destroyed.
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
		}, 1800000);
	}
});
module.exports = User;
