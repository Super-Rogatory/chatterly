const db = require('./db');
const Message = require('./models/Messages');
const User = require('./models/Users');
const Room = require('./models/Rooms');
const Participants = require('./models/Participants');

// register models
Message.belongsTo(User);
User.hasMany(Message);

Message.belongsTo(Room);
Room.hasMany(Message);

User.belongsToMany(Room, { through: Participants });
Room.belongsToMany(Message, { through: Participants });

module.exports = {
	db,
	Message,
	User,
	Room,
	Participants,
};
