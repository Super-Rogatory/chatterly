import { combineReducers } from 'redux';
import {
	toggleStatusReducer,
	toggleRoomListReducer,
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
	openRoomListTab: toggleRoomListReducer,
	isGuestExpired: guestExpiredReducer,
	noUser: missingUserReducer,
});

export default combinedReducer;
