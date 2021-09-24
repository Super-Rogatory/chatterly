const db = require('./db');
const Message = require('./models/Messages');
const User = require('./models/Users');

// register models
User.hasMany(Message);
Message.belongsTo(User);

module.exports = {
    db,
    Message,
    User
};
