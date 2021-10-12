const Sequelize = require('sequelize');
const Message = require('./Messages');
const Op = Sequelize.Op;

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

Room.getMessagesByRoom = async function (roomName) {
	const room = await this.findOne({ where: { name: roomName } });
	const messages = await Message.findAll({
		include: this,
		where: {
			roomId: {
				[Op.eq]: room.id,
			},
		},
		order: [['createdAt', 'ASC']],
	});
	return messages;
};
// instance methods
Room.prototype.getChatBot = async function () {
	const chatbots = await this.getChatbots();
	return chatbots[0];
};

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

module.exports = Room;
