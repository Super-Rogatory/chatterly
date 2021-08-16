import * as types from '../actions/actionTypes';

export const nameReducer = (state = '', action) => {
	switch (action.type) {
		case types.SET_NAME:
			return action.payload;
		default:
			return state;
	}
};
