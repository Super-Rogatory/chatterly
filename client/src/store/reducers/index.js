import { combineReducers } from 'redux';
import {
	toggleStatusReducer,
	guestExpiredReducer,
	missingUserReducer,
	toggleParticipantsReducer,
	saveIntervalIdStatusToState,
} from './misc';
import { usersInRoom } from './users';

const combinedReducer = combineReducers({
	users: usersInRoom,
	intervalId: saveIntervalIdStatusToState,
	isTriggered: toggleStatusReducer,
	openParticipantsTab: toggleParticipantsReducer,
	isGuestExpired: guestExpiredReducer,
	noUser: missingUserReducer,
});

export default combinedReducer;
