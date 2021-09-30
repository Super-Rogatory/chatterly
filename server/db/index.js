const db = require('./db');
const Message = require('./models/Messages');
const User = require('./models/Users');
const Room = require('./models/Rooms');
const Participants = require('./models/Participants');

// register models
// a user should have many messages.
Message.belongsTo(User);
User.hasMany(Message);

// a room should have many messages.
Message.belongsTo(Room);
Room.hasMany(Message);

// many users can be in many rooms. we will create a join table called Participants with reference to specific users, rooms, etc
User.belongsToMany(Room, { through: Participants });
Room.belongsToMany(User, { through: Participants });

module.exports = {
	db,
	Message,
	User,
	Room,
	Participants,
};
