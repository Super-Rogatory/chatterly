const Sequelize = require('sequelize');
const db = require('../db');

const Room = db.define('room', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		isUnique: true,
	},
});

/*
  getMessages: [Function],
  countMessages: [Function],
  hasMessage: [Function],
  hasMessages: [Function],
  setMessages: [Function],
  addMessage: [Function],
  addMessages: [Function],
  removeMessage: [Function],
  removeMessages: [Function],
  createMessage: [Function],
  getUsers: [Function],
  countUsers: [Function],
  hasUser: [Function],
  hasUsers: [Function],
  setUsers: [Function],
  addUser: [Function],
  addUsers: [Function],
  removeUser: [Function],
  removeUsers: [Function],
  createUser: [Function]
*/

// instance methods
Room.prototype.getChatBot = async function () {
	const users = await this.getUsers();
	return users[0];
};
// Room.prototype.hasChatBot = () => {};
// { force : true}
// hooks

Room.afterCreate(async (room) => {
	// room.createUser is a magic method we can utilize.
	try {
		// expectation: each room has a chatbot.
		await room.createUser({ name: 'ChatBot', room: room.name });
	} catch (err) {
		console.log('error creating chatbot \n => ', err);
	}
});

// Room.create({ name: 'test' })
// 	.then(() => console.log('yay'))
// 	.catch((err) => console.log(err));

// Room.create({ name: 'crest' })
// 	.then(() => console.log('yay'))
// 	.catch((err) => console.log(err));

module.exports = Room;
