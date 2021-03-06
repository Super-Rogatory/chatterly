import * as types from '../actions/actionTypes';
export const toggleStatusReducer = (state = false, action) => {
	switch (action.type) {
		case types.TOGGLE_POPUP:
			return action.status;
		default:
			return state;
	}
};

export const guestExpiredReducer = (state = false, action) => {
	switch (action.type) {
		case types.EXPIRED_GUEST:
			return action.status;
		default:
			return state;
	}
};

export const toggleParticipantsReducer = (state = false, action) => {
	switch (action.type) {
		case types.TOGGLE_PARTICIPANTS_TAB:
			return action.status;
		default:
			return state;
	}
};

export const toggleRoomListReducer = (state = false, action) => {
	switch (action.type) {
		case types.TOGGLE_ROOM_LIST_IN_HOME_PAGE:
			return action.status;
		default:
			return state;
	}
};

export const saveIntervalIdStatusToState = (state = {}, action) => {
	switch (action.type) {
		case types.SAVE_INTERVAL_FOR_USER_COUNT:
			return action.intervalId;
		case types.CLEAR_INTERVAL_FOR_USER_COUNT:
			return action.status;
		default:
			return state;
	}
};

export const missingUserReducer = (state = false, action) => {
	switch (action.type) {
		case types.MISSING_USER:
			return action.status;
		default:
			return state;
	}
};
