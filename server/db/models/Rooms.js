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
[
  '_customGetters',    '_customSetters',
  'validators',        '_hasCustomGetters',
  '_hasCustomSetters', 'rawAttributes',
  '_isAttribute',      'getChatBot',
  'getMessages',       'countMessages',
  'hasMessage',        'hasMessages',
  'setMessages',       'addMessage',
  'addMessages',       'removeMessage',
  'removeMessages',    'createMessage',
  'getUsers',          'countUsers',
  'hasUser',           'hasUsers',
  'setUsers',          'addUser',
  'addUsers',          'removeUser',
  'removeUsers',       'createUser',
  'getChatbots',       'countChatbots',
  'hasChatbot',        'hasChatbots',
  'setChatbots',       'addChatbot',
  'addChatbots',       'removeChatbot',
  'removeChatbots',    'createChatbot'
]
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
	// room.createChatbot is a magic method we can utilize.
	try {
		// expectation: each room has a chatbot.
		await room.createChatbot({ name: 'chatbot', room: room.name });
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
