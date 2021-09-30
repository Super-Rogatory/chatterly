import { combineReducers } from 'redux';
import { nameReducer } from './name';
import { roomReducer, roomsReducer } from './room';
import { usersInRoom, usersReducer, userReducer } from './users';
import { messagesReducer } from './message';
const combinedReducer = combineReducers({
	name: nameReducer,
	room: roomReducer,
	rooms: roomsReducer,
	user: userReducer,
	users: usersReducer,
	usersInRoom: usersInRoom,
	messages: messagesReducer,
});

export default combinedReducer;
