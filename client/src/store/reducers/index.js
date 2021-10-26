import { combineReducers } from 'redux';
import {
	toggleStatusReducer,
	guestExpiredReducer,
	missingUserReducer,
	toggleParticipantsReducer,
	saveIntervalIdStatusToState,
} from './misc';
import { nameReducer } from './name';
import { roomReducer } from './room';
import { usersInRoom } from './users';

const combinedReducer = combineReducers({
	name: nameReducer,
	room: roomReducer,
	users: usersInRoom,
	intervalId: saveIntervalIdStatusToState,
	isTriggered: toggleStatusReducer,
	openParticipantsTab: toggleParticipantsReducer,
	isGuestExpired: guestExpiredReducer,
	noUser: missingUserReducer,
});

export default combinedReducer;
