import * as types from '../actions/actionTypes';

export const roomReducer = (state = '', action) => {
	switch (action.type) {
		case types.SET_ROOM:
			return action.payload;
		default:
			return state;
	}
};
