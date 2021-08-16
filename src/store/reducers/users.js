import * as types from '../actions/actionTypes';

export const usersReducer = (state = [], action) => {
	switch (action.type) {
		case types.CREATE_USER:
			return [...state, action.payload];
		case types.DELETE_USER:
			return state.filter((user) => user.id !== action.id);
		case types.GET_USER:
			return action.payload;
		default:
			return state;
	}
};

export const usersInRoom = (state = [], action) => {
	switch(action.type) {
		case types.GET_USERS_IN_ROOM:
			return action.payload;
		default:
			return state;
	}
}
