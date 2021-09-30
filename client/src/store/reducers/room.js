import * as types from '../actions/actionTypes';

export const roomReducer = (state = '', action) => {
	switch (action.type) {
		case types.SET_ROOM:
			return action.payload;
		default:
			return state;
	}
};

export const roomsReducer = (state = [], action) => {
	switch (action.type) {
		case types.CREATE_ROOM:
			return [...state, action.room];
		default:
			return state;
	}
};
