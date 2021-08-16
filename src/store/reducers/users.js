import * as types from '../actions/actionTypes';

export const usersReducer = (state = [], action) => {
	switch (action.type) {
		case types.CREATE_USER:
			return [...state, action.payload];
		default:
			return state;
	}
};
