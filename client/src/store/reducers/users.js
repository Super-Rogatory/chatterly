import * as types from '../actions/actionTypes';

export const userReducer = (state = {}, action) => {
	switch (action.type) {
		case types.GET_USER:
			return action.user;
		default:
			return state;
	}
};

export const usersReducer = (state = [], action) => {
	switch (action.type) {
		case types.CREATE_USER:
			return [...state, action.payload];
		case types.DELETE_USER:
			return state.filter((user) => user.id !== action.id);
		case types.FETCH_USERS:
			return action.users;
		default:
			return state;
	}
};
