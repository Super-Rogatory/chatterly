import { combineReducers } from 'redux';
import { toggleStatusReducer, guestExpiredReducer, updateCountReducer, missingUserReducer } from './misc';
import { nameReducer } from './name';
import { roomReducer, roomsReducer } from './room';
import { usersReducer, userReducer } from './users';
const combinedReducer = combineReducers({
	name: nameReducer,
	room: roomReducer,
	rooms: roomsReducer,
	user: userReducer,
	users: usersReducer,
	isTriggered: toggleStatusReducer,
	isGuestExpired: guestExpiredReducer,
	updateCount: updateCountReducer,
	noUser: missingUserReducer,
});

export default combinedReducer;
