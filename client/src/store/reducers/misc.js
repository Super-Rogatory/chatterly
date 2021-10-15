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