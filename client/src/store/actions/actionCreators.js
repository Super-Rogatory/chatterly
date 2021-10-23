import * as types from './actionTypes';
export const _setName = (name) => {
	return {
		type: types.SET_NAME,
		payload: name,
	};
};
export const _setRoom = (room) => {
	return {
		type: types.SET_ROOM,
		payload: room,
	};
};
export const _createUser = (user) => {
	return {
		type: types.CREATE_USER,
		payload: user,
	};
};
export const _deleteUser = (id) => {
	return {
		type: types.DELETE_USER,
		id,
	};
};
export const _getUser = (user) => {
	return {
		type: types.GET_USER,
		user,
	};
};
export const _getUsers = (users) => {
	return {
		type: types.FETCH_USERS,
		users,
	};
};
export const _getUsersInRoom = (users) => {
	return {
		type: types.FETCH_USERS_IN_ROOM,
		usersInRoom: users,
	};
};
export const _addMessage = (message) => {
	return {
		type: types.ADD_MESSAGE,
		message,
	};
};
export const _getMessages = (messages) => {
	return {
		type: types.FETCH_MESSAGES,
		messages,
	};
};
export const _togglePopup = (status) => {
	return {
		type: types.TOGGLE_POPUP,
		status,
	};
};
export const _toggleParticipantsTab = (status) => {
	return {
		type: types.TOGGLE_PARTICIPANTS_TAB,
		status,
	};
};
export const _expiredGuest = (status) => {
	return {
		type: types.EXPIRED_GUEST,
		status,
	};
};
export const _missingUser = (status) => {
	return {
		type: types.MISSING_USER,
		status,
	};
};
