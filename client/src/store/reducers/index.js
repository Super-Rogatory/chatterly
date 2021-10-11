import { combineReducers } from 'redux';
import { nameReducer } from './name';
import { roomReducer, roomsReducer } from './room';
import { usersReducer, userReducer } from './users';
const combinedReducer = combineReducers({
	name: nameReducer,
	room: roomReducer,
	rooms: roomsReducer,
	user: userReducer,
	users: usersReducer,
});

export default combinedReducer;
