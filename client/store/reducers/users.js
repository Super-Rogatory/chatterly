import * as types from '../actions/actionTypes';

export const usersInRoom = (state = [], action) => {
	switch (action.type) {
		case types.GET_USERS_IN_ROOM:
			return action.users;
		default:
			return state;
	}
};
